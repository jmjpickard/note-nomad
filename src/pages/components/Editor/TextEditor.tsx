import {
  defaultValueCtx,
  Editor,
  editorViewOptionsCtx,
  rootCtx,
} from "@milkdown/core";
import type { FC } from "react";

import { commonmark } from "@milkdown/preset-commonmark";
import { Milkdown, useEditor, MilkdownProvider } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import {
  usePluginViewFactory,
  ProsemirrorAdapterProvider,
} from "@prosemirror-adapter/react";

import { slash, SlashView } from "./Slash";

import "@milkdown/theme-nord/style.css";

const markdown = `Type \`/\` to see the slash command.`;

export const MilkdownEditor: FC = () => {
  const pluginViewFactory = usePluginViewFactory();

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        ctx.set(slash.key, {
          view: pluginViewFactory({
            component: SlashView,
          }),
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
      .use(commonmark)
      .use(slash);
  }, []);

  return <Milkdown />;
};

export const TextEditor: React.FC = () => {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
};
