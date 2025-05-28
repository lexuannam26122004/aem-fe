// 1. Cài đặt thư viện cần thiết
// npm install @tinymce/tinymce-react

// 2. Tạo component TinyMCE Editor
// pages/components/TinyMCEEditor.js
import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditorType } from 'tinymce'
import { useTheme } from 'next-themes'

interface TinyMCEEditorProps {
    initialValue: string
    onChange: (content: string) => void
    apiKey: string
}
export default function TinyMCEEditor({ initialValue, apiKey, onChange }: TinyMCEEditorProps) {
    const editorRef = useRef<TinyMCEEditorType | null>(null)
    const { theme, systemTheme } = useTheme()

    const currentTheme = theme === 'system' ? systemTheme : theme

    const darkMode = currentTheme === 'dark'

    const darkModeCSS = `
        .mce-content-body {
            background-color: #2e3842 !important;
            color: #ddd !important;
        }

    `

    return (
        <Editor
            key={darkMode ? 'dark' : 'light'} // Re-render khi theme đổi
            apiKey={apiKey} // Đăng ký API key miễn phí tại https://www.tiny.cloud/
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={initialValue}
            init={{
                height: 500,
                menubar: true,
                // Cập nhật danh sách plugins, loại bỏ các plugin trùng lặp và không được hỗ trợ
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                    'save',
                    'autosave',
                    'codesample',
                    'directionality',
                    'emoticons',
                    'nonbreaking',
                    'pagebreak',
                    'quickbars'
                ],

                // Cập nhật toolbar, loại bỏ các tham chiếu đến plugin không được hỗ trợ
                toolbar:
                    'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help | link image media table codesample | ' +
                    'fullscreen preview save print | emoticons nonbreaking pagebreak',

                skin: darkMode ? 'oxide-dark' : 'oxide',
                content_css: darkMode ? 'dark' : 'default',

                // Thêm CSS tùy chỉnh cho dark mode nếu cần
                content_style: darkMode
                    ? `body { font-family:Helvetica,Arial,sans-serif; font-size:14px; } ${darkModeCSS}`
                    : 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }',

                // Thêm cấu hình này để giải quyết vấn đề con trỏ
                setup: function (editor: any) {
                    editor.on('init', function () {
                        editor.focus()
                    })
                },

                // Tích hợp tải ảnh lên
                automatic_uploads: true,
                file_picker_types: 'image',
                images_upload_handler: async function (blobInfo: any) {
                    // Thay thế bằng API upload ảnh của bạn
                    const formData = new FormData()
                    formData.append('file', blobInfo.blob(), blobInfo.filename())

                    try {
                        // Giả định API endpoint upload của bạn là /api/upload-image
                        const response = await fetch('/api/upload-image', {
                            method: 'POST',
                            body: formData
                        })

                        const data = await response.json()
                        return data.location // URL của ảnh đã được upload
                    } catch (error) {
                        console.error('Error uploading image:', error)
                        return ''
                    }
                },

                // Các thiết lập bổ sung
                contextmenu: 'link image table paste',
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                image_advtab: true,
                link_list: [
                    { title: 'My page 1', value: 'https://www.example.com' },
                    { title: 'My page 2', value: 'https://www.example.com/page2' }
                ],
                image_list: [
                    { title: 'My image 1', value: 'https://www.example.com/image.jpg' },
                    { title: 'My image 2', value: 'https://www.example.com/image2.jpg' }
                ],
                image_class_list: [
                    { title: 'None', value: '' },
                    { title: 'Responsive', value: 'img-fluid' }
                ],
                importcss_append: true,
                templates: [
                    {
                        title: 'New Table',
                        description: 'creates a new table',
                        content:
                            '<div class="table-responsive"><table class="table"><tbody><tr><td>Column 1</td><td>Column 2</td></tr></tbody></table></div>'
                    },
                    { title: 'Template 1', description: 'Description 1', content: 'Template content' }
                ],
                template_cdate_format: '[CDATE: %m/%d/%Y]',
                template_mdate_format: '[MDATE: %m/%d/%Y]',

                // Hỗ trợ lưu tự động
                autosave_ask_before_unload: true,
                autosave_interval: '30s',
                autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
                autosave_restore_when_empty: false,
                autosave_retention: '2m',

                // Hỗ trợ ngôn ngữ
                language: 'vi', // Sử dụng tiếng Việt nếu cần

                // Chế độ di động (responsive)
                mobile: {
                    plugins: 'autosave link lists autolink',
                    toolbar: 'undo redo | bold italic underline | link | bullist numlist'
                }
            }}
            onEditorChange={content => {
                if (onChange) onChange(content)
            }}
        />
    )
}
