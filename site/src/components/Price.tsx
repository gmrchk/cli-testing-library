import React from 'react';
import styled from 'styled-components';
import { media } from './Layout';

const Wrapper = styled.div`
    display: flex;
    position: relative;
    font-size: 150px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
    font-family: 'Montserrat', 'Inter', 'Source Sans Pro', -apple-system,
        BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;

    @media ${media.midUp} {
        font-size: 180px;
    }

    @media ${media.largeUp} {
        font-size: 240px;
    }

    strong {
        position: absolute;
        font-size: 20%;
        display: inline-block;
        bottom: 20px;
        right: -60px;
    }
`;

const Circle = styled.div`
    display: block;
    position: absolute;
    width: 240px;
    height: 240px;
    border-radius: 50%;
    background: linear-gradient(
        to bottom right,
        #28ea6b,
        #003e81,
        #2b02f6
    );
    opacity: 1;
    transition: 0s ease 0s;
    z-index: 2;

    @media ${media.midUp} {
        opacity: 0;
        width: 360px;
        height: 360px;
    }

    &:hover {
        opacity: 1;
        transition: 2s ease 0.6s;
    }

    &:before {
        content: '';
        display: block;
        top: -20px;
        right: -20px;
        bottom: -20px;
        left: -20px;
        position: absolute;
        border-radius: 50%;

        @media ${media.midUp} {
            top: -100px;
            right: -100px;
            bottom: -100px;
            left: -100px;
        }
    }
`;

const Holder = styled.div`
    position: relative;
    z-index: 3;
    pointer-events: none;
`;

export const Price: React.FC = ({ children }) => {
    return (
        <Wrapper>
            <Holder>{children}</Holder>
            <Circle />
        </Wrapper>
    );
};
