"use client";

import { ChangeEventHandler } from "react";

export default function InputComment(props: {
  comment: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  maxLength: number;
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
          {props.comment.length}/{props.maxLength}
        </span>
      </div>
      <textarea
        id="comment"
        value={props.comment}
        onChange={props.onChange}
        className="input-field"
        placeholder={props.placeholder}
        rows={3}
      />
    </div>
  );
}
