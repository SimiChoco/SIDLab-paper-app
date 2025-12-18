"use client";

import { ChangeEventHandler } from "react";

export const MAX_COMMENT_LENGTH = 20;

export default function InputComment(children: {
  comment: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          コメント
        </label>
        <span className="text-sm text-gray-500">
          {children.comment.length}/{MAX_COMMENT_LENGTH}
        </span>
      </div>
      <textarea
        id="comment"
        value={children.comment}
        onChange={children.onChange}
        className="input-field"
        placeholder={children.placeholder}
        rows={3}
      />
    </div>
  );
}
