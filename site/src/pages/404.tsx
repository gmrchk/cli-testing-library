import * as React from 'react';
import { Title } from '../components/Title';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { Head } from '../components/Head';
import '../components/common';

const NotFoundPage = () => {
    return (
        <div>
            <Head title={'404 | Page not found | CLI Testing Library'} />
            <Section hero notFound>
                <Title small>Page not found</Title>
                <Text>
                    You know what that means. It was removed, or never even
                    existed. Maybe someone played a mean joke on you.
                </Text>
                <Text>
                    In any way, don't worry, we got your back. <br /> Here's a
                    link back to the home page.
                </Text>
                <Button href="/">Go back home</Button>
            </Section>
        </div>
    );
};

export default NotFoundPage;
