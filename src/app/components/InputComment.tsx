"use client";

import { ChangeEventHandler } from "react";

export default function InputComment(children: {
  comment: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder: string;
  maxCommentLength: number;
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
          {children.comment.length}/{children.maxCommentLength}
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
