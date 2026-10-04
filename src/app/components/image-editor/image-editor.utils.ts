import type { ImageEditState } from "./image-editor.types"

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error("Failed to load image."))
        image.src = src
    })
}

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

const getRotatedBounds = (width: number, height: number, rotation: number) => {
    const radians = (rotation * Math.PI) / 180
    return {
        width:
            Math.abs(Math.cos(radians) * width) + Math.abs(Math.sin(radians) * height),
        height:
            Math.abs(Math.sin(radians) * width) + Math.abs(Math.cos(radians) * height),
    }
}

const createTransformedCanvas = (
    image: HTMLImageElement,
    rotation: number,
    flipHorizontal: boolean,
    flipVertical: boolean
) => {
    const bounds = getRotatedBounds(image.naturalWidth, image.naturalHeight, rotation)
    const canvas = document.createElement("canvas")
    canvas.width = Math.ceil(bounds.width)
    canvas.height = Math.ceil(bounds.height)
    const ctx = canvas.getContext("2d")
    if (!ctx)
        throw new Error("Canvas is not supported.")
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1)
    ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2)
    ctx.restore()
    return canvas
}

const getPixelCrop = (crop: ImageEditState["crop"], width: number, height: number) => {
    const x = clamp((crop.x / 100) * width, 0, width)
    const y = clamp((crop.y / 100) * height, 0, height)

    const cropWidth = clamp( (crop.width / 100) * width, 1, width - x)
    const cropHeight = clamp( (crop.height / 100) * height, 1, height - y)

    return {x, y, width: cropWidth, height: cropHeight}
}

const applySharpen = (ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) => {
    if (amount <= 0) return
    const imageData = ctx.getImageData(0, 0, width, height)
    const source = imageData.data
    const output = new Uint8ClampedArray(source)
    const strength = amount / 100

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = (y * width + x) * 4

            for (let channel = 0; channel < 3; channel++) {
                const center = source[index + channel] * (1 + 4 * strength)
                const top = source[index - width * 4 + channel] * strength
                const bottom = source[index + width * 4 + channel] * strength
                const left = source[index - 4 + channel] * strength
                const right = source[index + 4 + channel] * strength
                output[index + channel] = clamp(
                    center - top - bottom - left - right,
                    0,
                    255
                )
            }
        }
    }
    imageData.data.set(output)
    ctx.putImageData(imageData, 0, 0)
}

export const createEditedImage = async (file: File, state: ImageEditState): Promise<File> => {
    const sourceUrl = URL.createObjectURL(file)
    try {
        const image = await loadImage(sourceUrl)

        /*
         * Step 1
         *
         * Apply rotation + flip.
         */
        const transformedCanvas = createTransformedCanvas(
            image,
            state.rotation,
            state.flipHorizontal,
            state.flipVertical
        )

        const transformedWidth = transformedCanvas.width
        const transformedHeight = transformedCanvas.height

        /*
         * Step 2
         *
         * Convert percentage crop into pixels.
         */
        const crop = getPixelCrop(state.crop, transformedWidth, transformedHeight)

        /*
         * Step 3
         *
         * Create cropped output canvas.
         */
        const outputCanvas = document.createElement("canvas")
        outputCanvas.width = Math.round(crop.width)
        outputCanvas.height = Math.round(crop.height)
        const ctx = outputCanvas.getContext("2d")
        if (!ctx)
            throw new Error("Canvas is not supported.")

        /*
         * Step 4
         *
         * Apply image filters.
         */
        ctx.filter = [
            `brightness(${100 + state.filters.brightness}%)`,
            `contrast(${100 + state.filters.contrast}%)`,
            `saturate(${100 + state.filters.saturation}%)`,
            `grayscale(${state.filters.grayscale}%)`,
            `blur(${state.filters.blur}px)`,
        ].join(" ")

        ctx.drawImage(
            transformedCanvas,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            outputCanvas.width,
            outputCanvas.height
        )

        ctx.filter = "none"

        /*
         * Step 5
         *
         * Apply sharpen.
         */
        applySharpen(
            ctx,
            outputCanvas.width,
            outputCanvas.height,
            state.filters.sharpen
        )

        /*
         * Step 6
         *
         * Export as JPEG.
         */
        const blob = await new Promise<Blob>((resolve, reject) => {
            outputCanvas.toBlob(
                result => {
                    if (!result) {
                        reject(new Error("Failed to export image."))
                        return
                    }
                    resolve(result)
                },
                "image/jpeg",
                0.92
            )
        })

        return new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, "") + ".jpg",
            {
                type: "image/jpeg",
                lastModified: Date.now(),
            }
        )
    } finally {
        URL.revokeObjectURL(sourceUrl)
    }
}

export const createTransformPreview = async (
    file: File,
    rotation: number,
    flipHorizontal: boolean,
    flipVertical: boolean
) => {
    const sourceUrl = URL.createObjectURL(file)

    try {
        const image = await loadImage(sourceUrl)
        const canvas = createTransformedCanvas(
            image,
            rotation,
            flipHorizontal,
            flipVertical
        )
        return canvas.toDataURL("image/png")
    } finally {
        URL.revokeObjectURL(sourceUrl)
    }
}