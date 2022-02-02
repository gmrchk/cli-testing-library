import React from 'react';
import './styles.css';
import { Head } from '../components/Head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Section } from '../components/Section';
import { Title } from '../components/Title';
import { Code } from '../components/Code';
import { Headline, SubHeadline, Text } from '../components/Text';
import { Layout, Half } from '../components/Layout';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import '../components/common';

const codeExample = `it('testing CLI the way they are used', async () => {
    const { execute, spawn, cleanup, ls } = await prepareEnvironment();

    await execute(
        'node',
        './my-cli.js generate-file file.txt'
    );

    expect(ls('./')).toBe(\`
        Array [
          "file.txt",
        ]
    \`);
    
    const { waitForText, waitForFinish, writeText, pressKey, getExitCode } = await spawn(
        'node',
        './my-cli.js ask-for-name'
    );
    
    await waitForText('Enter your name:');
    await writeText('John');
    await pressKey('enter');
    await waitForFinish();
    
    expect(getExitCode()).toBe(0);
  
    await cleanup();
});`;

export default () => {
    return (
        <div>
            <Head title={'CLI Testing Library'} />
            <Notice />
            <Header />
            <Section hero>
                <Title>CLI Testing Library</Title>
                <Text>
                    Small but powerful library for testing CLI the way they are
                    used by people.
                </Text>
                <Layout thin>
                    <Code language="javascript">{codeExample}</Code>
                </Layout>
            </Section>
            <Section id="faq" thin></Section>
            <Section id="section2">
                <Headline>Section 2 Headline here</Headline>
                <Layout thin>
                    <Half>Something here</Half>
                    <Half>Something here too</Half>
                </Layout>
            </Section>
            <Section id="faq" thin>
                <Headline>Headline here</Headline>
                <SubHeadline>Maybe SubHeadline here?</SubHeadline>
                <Text>Some text...</Text>
            </Section>
            <Section id="buy" center last>
                <Headline>Ready to get started?</Headline>
                <Button href="https://github.com/gmrchk/LibName#readme">
                    Documentation
                </Button>
            </Section>
            <Footer />
        </div>
    );
};
