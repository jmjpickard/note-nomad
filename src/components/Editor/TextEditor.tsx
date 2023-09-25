import React from "react";
import type { FC } from "react";

import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor, MilkdownProvider } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import {
  usePluginViewFactory,
  ProsemirrorAdapterProvider,
} from "@prosemirror-adapter/react";

import { slash, SlashView } from "./Slash";

import "@milkdown/theme-nord/style.css";
import { api } from "~/utils/api";
import { Notes } from "@prisma/client";
import { SaveStatus } from "~/pages/notes/[date]";

const markdown = `Type \`/\` to see the slash command.`;

interface EditorProps {
  notes: Notes | null | undefined;
  notesLoading?: boolean;
  refetch: () => void;
  saveStatus: SaveStatus;
  setSaveStatus: React.Dispatch<React.SetStateAction<SaveStatus>>;
  selectedDate: Date;
}

export const MilkdownEditor: FC<EditorProps> = ({
  notes,
  refetch,
  saveStatus,
  setSaveStatus,
  selectedDate,
}: EditorProps) => {
  const pluginViewFactory = usePluginViewFactory();

  const [content, setContent] = React.useState<string>(
    notes?.content ? notes.content : markdown
  );

  const upsertNote = api.notes.upsertNote.useMutation();

  React.useEffect(() => {
    if (saveStatus === "save") {
      upsertNote.mutateAsync({
        date: selectedDate,
        id: notes?.id ?? "",
        content,
      });
      refetch();
    }
  }, [saveStatus]);

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, content);
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
        });
        ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
          if (prevMarkdown !== markdown) {
            setSaveStatus("canSave");
            setContent(markdown);
          }
        });
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            class: "editorMain",
            spellcheck: "false",
          },
        }));
      })
      .config(nord)
      .use(listener)
      .use(commonmark)
      .use(slash);
  }, []);

  return <Milkdown />;
};

export const TextEditor: React.FC<EditorProps> = ({
  notes,
  notesLoading,
  refetch,
  saveStatus,
  setSaveStatus,
  selectedDate,
}: EditorProps) => {
  return notesLoading ? (
    <div>Loading...</div>
  ) : (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor
          notes={notes}
          refetch={refetch}
          saveStatus={saveStatus}
          setSaveStatus={setSaveStatus}
          selectedDate={selectedDate}
        />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};
