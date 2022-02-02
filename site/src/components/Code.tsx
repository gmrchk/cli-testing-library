import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

type Props = {
    language: 'jsx' | 'html' | 'javascript';
};
const Wrapper = styled.div`
    position: relative;
    width: 100%;
`;
const Label = styled.div`
    position: absolute;
    background: #111;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    padding: 4px 8px;
    text-transform: uppercase;
    border-radius: 4px;
    bottom: 0;
    right: 15px;
    transform: translateY(50%);
    z-index: 1;
`;

export const InlineCode = styled.code`
    background: rgba(255, 255, 255, 0.2);
    padding: 4px 6px;
    border-radius: 3px;
`;

export const Code: React.FC<Props> = ({ children, language }) => {
    return (
        <Wrapper>
            <SyntaxHighlighter
                showLineNumbers={true}
                language={language}
                style={vscDarkPlus}
            >
                {children}
            </SyntaxHighlighter>
            <Label>{language}</Label>
        </Wrapper>
    );
};
