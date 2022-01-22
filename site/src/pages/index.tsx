import React from 'react';
import './styles.css';
import { Head } from '../components/Head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Section } from '../components/Section';
import { Title } from '../components/Title';
import { Headline, SubHeadline, Text } from '../components/Text';
import { Layout, Half } from '../components/Layout';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import '../components/common'

export default () => {
    return (
        <div>
            <Head title={'LibTitle'} />
            <Notice />
            <Header />
            <Section hero>
                <Title>LibTitle</Title>
                <Text>
                    Description here.
                </Text>
                <Button href="#">
                    Some button
                </Button>
                <Button href="https://github.com/gmrchk/LibName#readme" ghost>
                    Documentation
                </Button>
            </Section>
            <Section id="section2">
                <Headline>Section 2 Headline here</Headline>
                <Layout>
                    <Half>
                        Something here
                    </Half>
                    <Half>
                        Something here too
                    </Half>
                </Layout>
            </Section>
            <Section id="faq" thin>
                <Headline>Headline here</Headline>
                <SubHeadline>Maybe SubHeadline here?</SubHeadline>
                <Text>
                    Some text...
                </Text>
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
