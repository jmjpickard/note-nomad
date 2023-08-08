import { editorViewCtx } from "@milkdown/core";
import { Ctx } from "@milkdown/ctx";
import { slashFactory, SlashProvider } from "@milkdown/plugin-slash";
import {
  createCodeBlockCommand,
  wrapInHeadingCommand,
  wrapInBulletListCommand,
} from "@milkdown/preset-commonmark";
import { useInstance } from "@milkdown/react";
import { callCommand } from "@milkdown/utils";
import { usePluginViewContext } from "@prosemirror-adapter/react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./slash.module.css";

export const slash = slashFactory("Commands");

export const SlashView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const slashProvider = useRef<SlashProvider>();

  const { view, prevState } = usePluginViewContext();
  const [loading, get] = useInstance();
  const action = useCallback(
    (fn: (ctx: Ctx) => void) => {
      if (loading) return;
      get().action(fn);
    },
    [loading]
  );

  useEffect(() => {
    const div = ref.current;
    if (loading || !div) {
      return;
    }
    slashProvider.current = new SlashProvider({
      content: div,
      tippyOptions: {
        onMount: (_) => {
          (ref.current?.children[0] as HTMLButtonElement).focus();
        },
      },
    });

    return () => {
      slashProvider.current?.destroy();
    };
  }, [loading]);

  useEffect(() => {
    slashProvider.current?.update(view, prevState);
  });

  type commandType = "heading1" | "heading2" | "codeBlock" | "bullet";

  const command = (
    e: React.KeyboardEvent | React.MouseEvent,
    type: commandType
  ) => {
    e.preventDefault(); // Prevent the keyboad key to be inserted in the editor.
    action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const { dispatch, state } = view;
      const { tr, selection } = state;
      const { from } = selection;
      dispatch(tr.deleteRange(from - 1, from));
      view.focus();
      switch (type) {
        case "heading1":
          return callCommand(wrapInHeadingCommand.key, 2)(ctx);
        case "heading2":
          return callCommand(wrapInHeadingCommand.key, 3)(ctx);
        case "bullet":
          return callCommand(wrapInBulletListCommand.key)(ctx);
        case "codeBlock":
          return callCommand(createCodeBlockCommand.key)(ctx);
      }
    });
  };

  return (
    <div
      data-desc="This additional wrapper is useful for keeping slash component during HMR"
      aria-expanded="false"
    >
      <div ref={ref} className={styles.slashGroup}>
        <div
          onKeyDown={(e) => e.key === "Enter" && command(e, "heading1")}
          onMouseDown={(e) => {
            command(e, "heading1");
          }}
          className={styles.slashItem}
        >
          Heading 1
        </div>
        <div
          className={styles.slashItem}
          onKeyDown={(e) => e.key === "Enter" && command(e, "heading2")}
          onMouseDown={(e) => {
            command(e, "heading2");
          }}
        >
          Heading 2
        </div>
        <div
          className={styles.slashItem}
          onKeyDown={(e) => e.key === "Enter" && command(e, "bullet")}
          onMouseDown={(e) => {
            command(e, "bullet");
          }}
        >
          Bullet
        </div>
        <div
          className={styles.slashItem}
          onKeyDown={(e) => e.key === "Enter" && command(e, "codeBlock")}
          onMouseDown={(e) => {
            command(e, "codeBlock");
          }}
        >
          Code Block
        </div>
      </div>
    </div>
  );
};
