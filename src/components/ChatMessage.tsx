import React, { useState } from 'react';
import { Message } from '../types/chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  const CodeBlock: React.FC<{ inline?: boolean; className?: string; children?: React.ReactNode }>
    = ({ inline, className, children, ...props }) => {
    const [copied, setCopied] = useState(false);
    const isInline = Boolean(inline);

    if (isInline) {
      return (
        <code className={`inline-code ${className || ''}`} {...props}>{children}</code>
      );
    }

    const codeText = String(children || '');

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch (_) {
        // ignore
      }
    };

    return (
      <div className="code-block">
        <button className="copy-button" onClick={handleCopy} aria-label="Copy code">
          {copied ? 'Copied' : 'Copy'}
        </button>
        <pre className={className} {...props}>
          <code>{children}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
        isUser 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-800 rounded-bl-md'
      } shadow-sm`}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="markdown-body text-sm leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code: CodeBlock,
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p className={`text-xs mt-1 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};