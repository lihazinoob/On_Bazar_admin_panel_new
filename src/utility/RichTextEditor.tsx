import React from "react";
import { useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string; // The initial content of the editor
  onChange: (value: string) => void; // Callback to handle content changes
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit,TextStyle],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Pass HTML back to parent
    },
  });

  if (!editor) return null;

  return (
    <div className="py-2">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
        >
          Bold
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
        >
          Italic
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
        >
          List
        </Button>
      </div>

      {/* Editable Area */}
      <EditorContent
        editor={editor}
        className="min-h-[150px]  p-4border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      />
    </div>
  );
};

export default RichTextEditor;