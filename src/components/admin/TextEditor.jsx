import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function TextEditor() {
    return (
        <Editor
            apiKey='ref5swl16qbonjvm7kvtps71svrbgxn01uu5t27eu20z9f9z'
            init={{
                skin: "oxide",
                content_css: "default",

                branding: false,

                placeholder: "Type here...",

                content_style: `
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
                    body {
                        font-family: 'Montserrat', sans-serif !important;
                        font-size: 16px;
                        color: #333;
                    }
                    .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
                        content: attr(data-mce-placeholder);
                        color: #999 !important;
                        font-style: italic;
                        position: absolute;
                    }
                `,

                setup: (editor) => {
                    editor.on('init', () => {
                        document.querySelector('.tox-tinymce').style.border = '1px solid #01458E';
                        document.querySelector('.tox-tinymce').style.borderRadius = '10px';
                    });
                },

                plugins: [
                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tableofcontents', 'footnotes', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
            }}
        />
    );
}
