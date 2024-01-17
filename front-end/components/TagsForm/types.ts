import Tag from "../../types/Tag";

interface OnClose {
    (): void;
}

interface SetTags {
    (tags: Tag[]): void;
}

export interface TagsFormProps {
    tags: Tag[];
    open: boolean;
    onClose: OnClose;
    setTags: SetTags;
}
  