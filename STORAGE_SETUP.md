# Appwrite Storage Setup for File Uploads

## Setup Instructions

1. **Create Storage Bucket in Appwrite Console:**
   - Go to your Appwrite Console
   - Navigate to Storage
   - Click "Create Bucket"
   - Set Bucket ID: `form_files_bucket`
   - Configure permissions:
     - Read: `any`
     - Create: `any`
     - Update: `users`
     - Delete: `users`

2. **File Upload Limits:**
   - Maximum file size: 10MB
   - Allowed file types:
     - Images: JPEG, PNG, GIF, WebP
     - Documents: PDF, TXT, DOC, DOCX, XLS, XLSX

3. **Environment Variable:**
   The bucket ID is already configured in `.env.local`:
   ```
   NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID=form_files_bucket
   ```

## Features Implemented

✅ **File Upload Component**
- Drag & drop interface
- File type validation
- Size limit validation (10MB)
- Upload progress indicator
- File preview with name and size

✅ **Storage Integration**
- Files stored in Appwrite Storage
- Unique file IDs generated
- File URLs for viewing/downloading
- Proper error handling

✅ **Analytics Support**
- File uploads tracked in analytics
- File names displayed in response tables
- Clickable file links in analytics
- CSV export includes file names

✅ **Form Response Handling**
- File metadata stored instead of File objects
- Proper serialization for database storage
- File information preserved in responses

## File Data Structure

When a file is uploaded, it's stored as:
```json
{
  "fileId": "unique_file_id",
  "fileName": "original_filename.pdf",
  "fileUrl": "https://appwrite.../view?project=...",
  "originalName": "document.pdf",
  "size": 1024000,
  "type": "application/pdf"
}
```

## Security Notes

- Files are stored with public read access for form responses
- File uploads are validated for type and size
- Unique IDs prevent file name conflicts
- File URLs include project authentication