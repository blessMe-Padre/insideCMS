declare module '@cubone/react-file-manager' {
    export interface FileManagerFile {
        name: string;
        path: string;
        isDirectory: boolean;
        updatedAt: string;
        size: number;
        mime_type: string;
    }

    export interface FileUploadConfig {
        url: string;
        method: string;
        headers?: Record<string, string>;
    }

    export interface FileManagerProps {
        files: FileManagerFile[];
        collapsibleNav?: boolean;
        enableFilePreview?: boolean;
        language?: string;
        initialPath?: string;
        fileUploadConfig?: FileUploadConfig;
        onDelete?: (files: FileManagerFile | FileManagerFile[]) => void;
        onRefresh?: () => void;
        onUpload?: (files: FileManagerFile | FileManagerFile[]) => void;
        permissions?: {
            create?: boolean;
            delete?: boolean;
            download?: boolean;
            copy?: boolean;
            move?: boolean;
            rename?: boolean;
            upload?: boolean;
        };
    }

    export const FileManager: React.FC<FileManagerProps>;
}

declare module '@cubone/react-file-manager/dist/style.css';

