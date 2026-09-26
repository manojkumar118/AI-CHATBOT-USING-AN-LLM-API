import React from 'react';
import { marked, Token, Tokens } from 'marked';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  // If empty or loading
  if (!content) return null;

  try {
    const tokens = marked.lexer(content);

    const renderInline = (text: string): React.ReactNode => {
      // Basic bold, italic, inline code and link rendering
      // Replace **bold**
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          return <em key={i} className="italic text-white/90">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-cyan-300 text-[13px]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
          const match = part.match(/\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <a
                key={i}
                href={match[2]}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
              >
                {match[1]}
              </a>
            );
          }
        }
        return part;
      });
    };

    const renderToken = (token: Token, index: number): React.ReactNode => {
      switch (token.type) {
        case 'heading': {
          const hToken = token as Tokens.Heading;
          const content = renderInline(hToken.text);
          if (hToken.depth === 1) {
            return <h1 key={index} className="text-2xl font-bold text-white mt-6 mb-3 tracking-tight">{content}</h1>;
          }
          if (hToken.depth === 2) {
            return <h2 key={index} className="text-xl font-bold text-white mt-5 mb-2.5 tracking-tight">{content}</h2>;
          }
          if (hToken.depth === 3) {
            return <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{content}</h3>;
          }
          return <h4 key={index} className="text-base font-semibold text-white mt-3 mb-1.5">{content}</h4>;
        }

        case 'paragraph': {
          const pToken = token as Tokens.Paragraph;
          return (
            <p key={index} className="text-[#F5F5F7] leading-relaxed my-2 text-sm sm:text-base">
              {renderInline(pToken.text)}
            </p>
          );
        }

        case 'code': {
          const cToken = token as Tokens.Code;
          return <CodeBlock key={index} language={cToken.lang || 'text'} code={cToken.text} />;
        }

        case 'list': {
          const lToken = token as Tokens.List;
          const ListTag = lToken.ordered ? 'ol' : 'ul';
          return (
            <ListTag
              key={index}
              className={`my-3 pl-6 space-y-1.5 text-sm sm:text-base text-[#F5F5F7] ${
                lToken.ordered ? 'list-decimal' : 'list-disc marker:text-cyan-400'
              }`}
            >
              {lToken.items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item.text)}
                </li>
              ))}
            </ListTag>
          );
        }

        case 'blockquote': {
          const bToken = token as Tokens.Blockquote;
          return (
            <blockquote
              key={index}
              className="my-3 pl-4 border-l-2 border-indigo-500/60 bg-white/[0.02] py-2 pr-3 rounded-r text-[#9A9AA3] italic text-sm"
            >
              {renderInline(bToken.text)}
            </blockquote>
          );
        }

        case 'table': {
          const tToken = token as Tokens.Table;
          return (
            <div key={index} className="my-4 overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#15151B] border-b border-white/10 text-white font-semibold">
                  <tr>
                    {tToken.header.map((col, cIdx) => (
                      <th key={cIdx} className="p-3">
                        {renderInline(col.text)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#0E0E12]">
                  {tToken.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02]">
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-3 text-[#F5F5F7]">
                          {renderInline(cell.text)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        case 'hr':
          return <hr key={index} className="my-6 border-white/10" />;

        default:
          return (
            <div key={index} className="my-1 text-sm sm:text-base text-[#F5F5F7]">
              {renderInline(token.raw)}
            </div>
          );
      }
    };

    return (
      <div className="prose prose-invert max-w-none space-y-2">
        {tokens.map((token, i) => renderToken(token, i))}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-cursor-blink align-middle" />
        )}
      </div>
    );
  } catch (err) {
    // Graceful fallback if marked encounters parsing issue
    return (
      <div className="whitespace-pre-wrap text-sm sm:text-base text-[#F5F5F7] leading-relaxed">
        {content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-cursor-blink align-middle" />
        )}
      </div>
    );
  }
};
