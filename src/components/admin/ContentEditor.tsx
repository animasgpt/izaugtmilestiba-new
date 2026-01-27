import { useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteContent, useUpdateContent } from "@/hooks/useSiteContent";

interface ContentEditorProps {
  item: SiteContent;
}

const FONT_OPTIONS = [
  { value: "Lato", label: "Lato (Sans-serif)" },
  { value: "Playfair Display", label: "Playfair Display (Serif)" },
];

const FONT_SIZE_OPTIONS = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "48px",
  "56px",
  "64px",
];

const ContentEditor = ({ item }: ContentEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content);
  const [fontFamily, setFontFamily] = useState(item.font_family);
  const [fontSize, setFontSize] = useState(item.font_size);
  const updateContent = useUpdateContent();

  const handleSave = async () => {
    await updateContent.mutateAsync({
      id: item.id,
      content,
      font_family: fontFamily,
      font_size: fontSize,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(item.content);
    setFontFamily(item.font_family);
    setFontSize(item.font_size);
    setIsEditing(false);
  };

  const keyLabels: { [key: string]: string } = {
    hero_title: "Galvenais virsraksts",
    hero_quote: "Citāts",
    hero_subtitle_1: "Apakšvirsraksts 1",
    hero_subtitle_2: "Apakšvirsraksts 2",
    hero_author: "Autora vārds",
    about_title: "Par mani - virsraksts",
    about_description: "Par mani - apraksts",
    services_title: "Pakalpojumi - virsraksts",
    book_title: "Grāmata - virsraksts",
    book_description: "Grāmata - apraksts",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="font-semibold text-foreground">
            {keyLabels[item.key] || item.key}
          </h3>
          <p className="text-xs text-muted-foreground">ID: {item.key}</p>
        </div>
        {!isEditing && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Teksts
            </label>
            {content.length > 100 ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full"
              />
            ) : (
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Fonts
              </label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Izmērs
              </label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div
            className="p-4 bg-accent/30 rounded-lg"
            style={{
              fontFamily: fontFamily,
              fontSize: fontSize,
            }}
          >
            <p className="text-muted-foreground text-xs mb-2">Priekšskatījums:</p>
            <p className="text-foreground">{content}</p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Atcelt
            </Button>
            <Button onClick={handleSave} disabled={updateContent.isPending}>
              <Save className="w-4 h-4 mr-2" />
              Saglabāt
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p
            className="text-foreground"
            style={{
              fontFamily: item.font_family,
              fontSize: item.font_size,
            }}
          >
            {item.content}
          </p>
          <p className="text-xs text-muted-foreground">
            Fonts: {item.font_family} | Izmērs: {item.font_size}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
