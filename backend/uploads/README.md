# Uploads Directory

This directory is used for storing uploaded files in the EcoSajha application.

## Structure

```
uploads/
├── profile-images/     # User profile images
├── item-images/        # Recycling item images
├── posted-items/       # Posted item images
└── documents/          # Other documents
```

## File Types Allowed

- Images: JPEG, JPG, PNG, GIF, WebP
- Maximum file size: 5MB per file
- Maximum files per upload: 5

## Security

- All uploaded files are validated for type and size
- Files are renamed with unique timestamps to prevent conflicts
- Only authenticated users can upload files
- File paths are sanitized to prevent directory traversal attacks

## Usage

Files uploaded through the application will be automatically stored in the appropriate subdirectory based on the upload type.

## Backup

This directory should be included in your backup strategy as it contains user-generated content.

## Cleanup

Old or unused files should be periodically cleaned up to save storage space. 