import type { FC } from "react";
import { api } from "~/utils/api";
import styles from "./tags.module.css";
import React, { useState } from "react";

interface TagsProps {
  date: Date;
}

export const Tags: FC<TagsProps> = ({ date }: TagsProps) => {
  const { data, isLoading, refetch } = api.tags.getTags.useQuery({
    date,
  });
  const createTag = api.tags.addTag.useMutation();
  const deleteTag = api.tags.deleteTag.useMutation();

  const [show, setShow] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [tagName, setTagName] = useState("");
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [hoveredPosition, setHoveredPosition] = useState({ top: 0, left: 0 });

  const handleClick = (tagId: string) => {
    setShow(!show);
    setSelectedTag(tagId);

    // Calculate the position of the tag div
    const tagElement = document.getElementById(`tag-${tagId}`);
    if (tagElement) {
      const rect = tagElement.getBoundingClientRect();
      setModalPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  };

  const handleMouseHover = (tagId: string | null) => {
    const tagElement = document.getElementById(`tag-${tagId}`);
    if (tagElement) {
      setHoveredTag(tagId);
      const rect = tagElement.getBoundingClientRect();
      setHoveredPosition({
        top: rect.top - window.scrollY - 7,
        left: rect.left - window.scrollX,
      });
    }
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedTag(null);
  };

  const handleCreateTag = () => {
    createTag.mutateAsync(
      {
        date,
        name: tagName,
      },
      { onSuccess: () => refetch() }
    );
    handleCloseModal();
  };

  const handleDeleteTag = (tagId: string) => {
    deleteTag.mutateAsync({ id: tagId }, { onSuccess: () => refetch() });
    handleCloseModal();
  };

  return (
    <>
      <div className={styles.tagsContainer}>
        {data?.length === 0 || data === undefined ? (
          <div
            id={`tag-addNew`}
            onClick={() => handleClick("addNew")}
            className={styles.tag}
          >
            + Add tag
          </div>
        ) : (
          <>
            <div
              id={`tag-addNew`}
              onClick={() => handleClick("addNew")}
              className={styles.tag}
            >
              + Add tag
            </div>
            {data.map((tag) => (
              <div
                className={styles.tag}
                key={`tag-${tag.id}`}
                id={`tag-${tag.id}`}
                onMouseEnter={() => handleMouseHover(tag.id)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                {tag.name}
                {hoveredTag === tag.id && (
                  <div
                    className={styles.deleteButton}
                    style={{
                      top: hoveredPosition.top,
                      left: hoveredPosition.left,
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the click from triggering the tag click
                      handleDeleteTag(tag.id);
                    }}
                  >
                    X
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
      {show && (
        <div
          className={styles.tagModal}
          style={{ top: modalPosition.top, left: modalPosition.left }}
        >
          <div onClick={handleCloseModal}>X</div>
          <input onChange={(e) => setTagName(e.target.value)} />
          <button onClick={handleCreateTag}>Create tag</button>
        </div>
      )}
    </>
  );
};
