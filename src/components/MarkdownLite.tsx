import Link from "next/link";
import React, { FC } from "react";
type MarkdownLiteProps = {
  text: string;
};
const MarkdownLite: FC<MarkdownLiteProps> = ({ text }) => {
  const link = /\[(.+?)\]\((.+?)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = link.exec(text)) !== null) {
    const [fullMatch, linkText, linkUrl] = match;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;
    if (lastIndex < matchStart) {
      parts.push(text.slice(lastIndex, matchStart));
    }
    parts.push(
      <Link
        className="text-blue-600 break-words underline underline-offset-2"
        href={linkUrl}
        key={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}
      </Link>
    );
    lastIndex = matchEnd;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return (
    <>
      {parts.map((part, index) => (
        <React.Fragment key={index}>{part}</React.Fragment>
      ))}
    </>
  );
};

export default MarkdownLite;
