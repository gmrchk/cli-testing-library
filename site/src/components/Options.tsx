import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Switch, TripleSwitch } from './Switch';
import { media } from './Layout';
import { generatePrettyColor } from '../utils/colorGenerator';

const Wrapper = styled.div`
    display: block;
    position: relative;
    font-size: 16px;
`;

const Option = styled.div`
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 16px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    padding: 6px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    //z-index: 1;
    height: 46px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const Desc = styled.div`
    display: block;
    position: relative;
    z-index: 5;
    pointer-events: none;
    font-size: 14px;
    padding: 0 10px 0 0;
    font-weight: 700;

    @media ${media.midUp} {
        font-size: 16px;
    }
`;

const Controls = styled.div`
    color: #888;
    text-transform: uppercase;
    font-size: 10px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    font-weight: 700;

    @media ${media.midUp} {
        font-size: 12px;
    }
`;

export const generateColorPair = () => {
    const hue = Math.floor(Math.random() * 360);
    const oppositeHue = hue > 180 ? hue - 180 : hue + 180;

    return {
        color: generatePrettyColor(hue),
        dotColor: generatePrettyColor(oppositeHue),
    };
};

const Rainbow = styled.div`
    display: block;
    background-color: #efd002;
    background-image: linear-gradient(
        319deg,
        #efd002 0%,
        #31b74a 37%,
        #442ce0 100%
    );
    position: absolute;
    z-index: 3;
    opacity: 0;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transition: opacity 0.3s;
    border-radius: 3px;

    &:hover {
        opacity: 1;
    }
`;

const Shape1 = styled.div`
    display: inline-block;
    width: 28px;
    height: 28px;
    background: #666;
    background: #160C43;
    margin: 0 0 0 10px;

    @media ${media.midUp} {
        width: 32px;
        height: 32px;
    }
`;

const Shape2 = styled.div`
    display: inline-block;
    width: 28px;
    height: 28px;
    background: #666;
    background: rgb(112, 65, 176);
    margin: 0 0 0 10px;
    border-radius: 7px;

    @media ${media.midUp} {
        width: 32px;
        height: 32px;
    }
`;

const Shape3 = styled.div`
    display: inline-block;
    width: 28px;
    height: 28px;
    background: #666;
    background: rgb(67, 66, 234);
    margin: 0 0 0 10px;
    border-radius: 16px;

    @media ${media.midUp} {
        width: 32px;
        height: 32px;
    }
`;

export const Options: React.FC = () => {
    return (
        <Wrapper>
            <Option>
                <Desc>Switch option</Desc>
                <Controls>
                    <Switch
                        aria-label="Switch option"
                        initial={true}
                        onChange={() => {}}
                    />
                </Controls>
            </Option>
            <Option
                onMouseOver={() => {}}
                onMouseLeave={() => {}}
            >
                <Desc>Rotating option</Desc>
                <Controls>just hover over</Controls>
            </Option>
            <Option>
                <Desc>Shapes option</Desc>
                <Controls>
                    <Shape1 />
                    <Shape2 />
                    <Shape3 />
                </Controls>
            </Option>
            <Option>
                <Desc>Data attr option</Desc>
                <Controls>just hover over</Controls>
            </Option>
            <Option
                onMouseOver={() => {}}
                onMouseLeave={() => {}}
            >
                <Rainbow />
                <Desc>Toggle option on hover in/out</Desc>
                <Controls>just hover over</Controls>
            </Option>
            <Option>
                <Desc>Tripple switch option</Desc>
                <Controls>
                    <TripleSwitch
                        aria-label="Spring preset option switch"
                        onChange={() => {}}
                        options={['option1', 'option2', 'option3']}
                    />
                </Controls>
            </Option>
        </Wrapper>
    );
};
