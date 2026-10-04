"use client"

import {FlipHorizontal, FlipVertical} from "lucide-react"

type Props = {
    rotation: number
    flipHorizontal: boolean
    flipVertical: boolean
    onRotate: (value: number) => void
    onFlipHorizontal: () => void
    onFlipVertical: () => void
    onReset: () => void
}

const ImageEditorToolbar = ({
    rotation,
    flipHorizontal,
    flipVertical,
    onRotate,
    onFlipHorizontal,
    onFlipVertical,
    onReset,
}: Props) => {
    return (
        <div className="space-y-4 border-t border-zinc-200 pt-4">
            {/* Rotation */}

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-900">
                        Rotation
                    </span>

                    <span className="text-xs tabular-nums text-zinc-400">
                        {rotation}°
                    </span>
                </div>

                <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={rotation}
                    onChange={event =>
                        onRotate(Number(event.target.value))
                    }
                    className="w-full"
                />

                <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
                    <span>-180°</span>
                    <span>0°</span>
                    <span>180°</span>
                </div>
            </div>

            {/* Transform */}

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={onFlipHorizontal}
                        title="Flip horizontally"
                        aria-label="Flip horizontally"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            flipHorizontal
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                    >
                        <FlipHorizontal size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={onFlipVertical}
                        title="Flip vertically"
                        aria-label="Flip vertically"
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
                            flipVertical
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                        }`}
                    >
                        <FlipVertical size={18} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}

export default ImageEditorToolbar