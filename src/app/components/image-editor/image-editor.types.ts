export type CropArea = {
    x: number
    y: number
    width: number
    height: number
}

export type ImageFilters = {
    brightness: number
    contrast: number
    saturation: number
    grayscale: number
    blur: number
    sharpen: number
}

export type ImageEditState = {
    crop: CropArea
    zoom: number
    rotation: number
    flipHorizontal: boolean
    flipVertical: boolean
    filters: ImageFilters
}

export type ImageEditorProps = {
    file: File
    initialState?: ImageEditState
    onCancel: () => void
    onSave: (
        file: File,
        state: ImageEditState
    ) => void | Promise<void>
}