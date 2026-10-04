"use client"

import { SyntheticEvent, useEffect, useRef, useState} from "react"
import ReactCrop, { type Crop} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Minus, Plus} from "lucide-react"
import ImageEditorToolbar from "./ImageEditorToolbar"
import { createEditedImage, createTransformPreview} from "./image-editor.utils"
import type { ImageEditState, ImageEditorProps, ImageFilters} from "./image-editor.types"

const DEFAULT_FILTERS: ImageFilters = {
    brightness: 0, contrast: 0, saturation: 0, grayscale: 0, blur: 0, sharpen: 0,
}
const DEFAULT_CROP: Crop = {
    unit: "%", x: 10, y: 10, width: 80, height: 80
}
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const ImageEditor = ({file, initialState, onCancel, onSave}: ImageEditorProps) => {
    const imageRef = useRef<HTMLImageElement | null>(null)
    const initialStateApplied = useRef(false)
    const [previewUrl, setPreviewUrl] = useState("")
    const [crop, setCrop] = useState<Crop>(
        initialState?.crop? {
            unit: "%",
            x: initialState.crop.x,
            y: initialState.crop.y,
            width: initialState.crop.width,
            height: initialState.crop.height,
        }
        : DEFAULT_CROP
    )

    const [zoom, setZoom] = useState(initialState?.zoom ?? 1)
    const [rotation, setRotation] = useState(initialState?.rotation ?? 0)
    const [flipHorizontal, setFlipHorizontal] = useState(initialState?.flipHorizontal ?? false)
    const [flipVertical, setFlipVertical] = useState(initialState?.flipVertical ?? false)
    const [filters, setFilters] = useState<ImageFilters>(initialState?.filters ?? DEFAULT_FILTERS)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    /*
     * Generate transformed image preview.
     *
     * Rotation and flip are represented by the
     * actual image ReactCrop sees.
     */
    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const url = await createTransformPreview(
                    file, rotation, flipHorizontal, flipVertical
                )
                if (!cancelled)
                    setPreviewUrl(url)
            } catch (error) {
                console.error(error)
                if (!cancelled)
                    setError("Unable to load image.")
            }
        }
        load()
        return () => { cancelled = true }
    }, [ file, rotation, flipHorizontal, flipVertical])

    /*
     * Restore the previous crop when re-editing.
     *
     * Crop coordinates are percentages, so the crop
     * remains valid even when rotation changes the
     * transformed image dimensions.
     */
    useEffect(() => {
        if (!previewUrl || initialStateApplied.current) return

        if (initialState?.crop) {
            setCrop({
                unit: "%",
                x: clamp(initialState.crop.x, 0, 100),
                y: clamp(initialState.crop.y, 0, 100),
                width: clamp(initialState.crop.width, 1, 100),
                height: clamp(initialState.crop.height, 1, 100),
            })
        } else {
            setCrop(DEFAULT_CROP)
        }
        initialStateApplied.current = true
    }, [previewUrl, initialState])

    /*
     * Keep the current image element available for
     * future image measurements if needed.
     */
    const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        imageRef.current = event.currentTarget
        if (initialStateApplied.current) return

        if (initialState?.crop) {
            setCrop({
                unit: "%",
                x: clamp(initialState.crop.x, 0, 100),
                y: clamp(initialState.crop.y, 0, 100),
                width: clamp(initialState.crop.width, 1, 100),
                height: clamp(initialState.crop.height, 1, 100),
            })
        } else {
            setCrop(DEFAULT_CROP)
        }
        initialStateApplied.current = true
    }

    const updateFilter = (key: keyof ImageFilters, value: number) => {
        setFilters(current => ({
            ...current, [key]: value
        }))
    }

    const updateRotation = (value: number) => setRotation(clamp(value, -180, 180))

    const reset = () => {
        setZoom(1)
        setRotation(0)
        setFlipHorizontal(false)
        setFlipVertical(false)
        setFilters(DEFAULT_FILTERS)
        setCrop(DEFAULT_CROP)
        setError("")
    }

    const handleSave = async () => {
        if (!previewUrl) {
            setError("Please wait for the image to finish loading.")
            return
        }
        try {
            setSaving(true)
            setError("")
            const state: ImageEditState = {
                crop: {
                    x: crop.x,
                    y: crop.y,
                    width: crop.width,
                    height: crop.height,
                },
                zoom,
                rotation,
                flipHorizontal,
                flipVertical,
                filters,
            }
            const editedFile = await createEditedImage(file, state)
            await onSave(editedFile, state)
        } catch (error) {
            console.error("Image editor:", error)
            setError(
                error instanceof Error ? error.message : "Failed to process image."
            )
        } finally {
            setSaving(false)
        }
    }

    const filtersConfig = [
        {
            key: "brightness" as const,
            label: "Brightness",
            min: -100,
            max: 100,
            step: 1,
        },
        {
            key: "contrast" as const,
            label: "Contrast",
            min: -100,
            max: 100,
            step: 1,
        },
        {
            key: "saturation" as const,
            label: "Saturation",
            min: -100,
            max: 100,
            step: 1,
        },
        {
            key: "grayscale" as const,
            label: "Grayscale",
            min: 0,
            max: 100,
            step: 1,
        },
        {
            key: "blur" as const,
            label: "Blur",
            min: 0,
            max: 10,
            step: 0.1,
        },
        {
            key: "sharpen" as const,
            label: "Sharpen",
            min: 0,
            max: 100,
            step: 1,
        },
    ]

    return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
        <div className="flex h-[min(850px,calc(100vh-32px))] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}

            <header className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-zinc-900">
                        Edit image
                    </h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                        Crop, transform and adjust your image
                    </p>
                </div>

                <button type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                >
                    Cancel
                </button>
            </header>

            {/* Body */}

            <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="grid min-h-full lg:grid-cols-[minmax(0,1fr)_320px]">
                    {/* Canvas area */}

                    <div className="flex min-h-[480px] items-center justify-center overflow-auto bg-zinc-950 p-6">
                        <div className="flex max-h-full max-w-full items-center justify-center">
                            {previewUrl &&
                                <ReactCrop crop={crop}
                                    onChange={nextCrop => setCrop(nextCrop)}
                                    keepSelection
                                    minWidth={20}
                                    minHeight={20}
                                >
                                    <img ref={imageRef}
                                        data-image-editor-image="true"
                                        src={previewUrl}
                                        alt="Edit image"
                                        onLoad={handleImageLoad}
                                        style={{
                                            width: `${Math.max(1, zoom * 100)}%`,
                                            maxWidth: "none",
                                            filter: [
                                                `brightness(${100 + filters.brightness}%)`,
                                                `contrast(${100 + filters.contrast}%)`,
                                                `saturate(${100 + filters.saturation}%)`,
                                                `grayscale(${filters.grayscale}%)`,
                                                `blur(${filters.blur}px)`,
                                            ].join(" "),
                                            display: "block",
                                        }}
                                    />
                                </ReactCrop>
                            }
                        </div>
                    </div>

                    {/* Controls */}

                    <aside className="border-t border-zinc-200 bg-white p-5 lg:border-l lg:border-t-0">
                        <div className="space-y-7">
                            {/* Zoom */}

                            <section>
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-900">
                                        Zoom
                                    </span>

                                    <span className="text-xs tabular-nums text-zinc-400">
                                        {zoom.toFixed(1)}×
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button type="button"
                                        onClick={() => setZoom(value => Math.max(1, value - 0.1))}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    <input type="range"
                                        min="1"
                                        max="4"
                                        step="0.1"
                                        value={zoom}
                                        onChange={event => setZoom(Number(event.target.value))}
                                        className="w-full"
                                    />

                                    <button type="button"
                                        onClick={() => setZoom(value => Math.min(4, value + 0.1))}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </section>

                            {/* Transform */}

                            <ImageEditorToolbar
                                rotation={rotation}
                                flipHorizontal={flipHorizontal}
                                flipVertical={flipVertical}
                                onRotate={updateRotation}
                                onFlipHorizontal={() => setFlipHorizontal(value => !value)}
                                onFlipVertical={() => setFlipVertical(value => !value)}
                                onReset={reset}
                            />

                            {/* Filters */}

                            <section>
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-sm font-medium text-zinc-900">
                                        Adjust
                                    </p>

                                    <button type="button"
                                        onClick={() => setFilters(DEFAULT_FILTERS)}
                                        className="text-xs font-medium text-zinc-500 hover:text-zinc-900"
                                    >
                                        Reset
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {filtersConfig.map(filter => {
                                        const value = filters[filter.key]
                                        return (
                                            <div key={filter.key}>
                                                <div className="mb-1.5 flex items-center justify-between">
                                                    <label className="text-xs text-zinc-600">
                                                        {filter.label}
                                                    </label>
                                                    <span className="text-xs tabular-nums text-zinc-400">
                                                        {value}
                                                    </span>
                                                </div>

                                                <input
                                                    type="range"
                                                    min={filter.min}
                                                    max={filter.max}
                                                    step={filter.step}
                                                    value={value}
                                                    onChange={event =>
                                                        updateFilter(
                                                            filter.key,
                                                            Number(event.target.value)
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </section>

                            {error &&
                                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            }
                        </div>
                    </aside>
                </div>
            </div>

            {/* Footer */}

            <footer className="flex items-center justify-between border-t border-zinc-200 px-5 py-4">
                <button type="button"
                    onClick={reset}
                    disabled={saving}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                    Reset all
                </button>

                <div className="flex items-center gap-3">
                    <button type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                    >
                        Cancel
                    </button>

                    <button type="button"
                        onClick={handleSave}
                        disabled={saving || !previewUrl}
                        className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Processing..." : "Save image"}
                    </button>
                </div>
            </footer>
        </div>
    </div>
}

export default ImageEditor