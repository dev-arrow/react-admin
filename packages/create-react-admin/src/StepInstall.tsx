import * as React from 'react';
import SelectInput from 'ink-select-input';
import { ChoiceType, SelectInputChoice } from './SelectInputChoice.js';
import { Text } from 'ink';
import { Stack } from './Stack.js';

const choices: ChoiceType[] = [
    {
        label: 'Using npm',
        value: 'npm',
    },
    {
        label: 'Using yarn',
        value: 'yarn',
    },
    {
        label: "Don't install dependencies, I'll do it myself.",
        value: '',
    },
];

export const StepInstall = ({
    onSubmit,
}: {
    onSubmit: (value: string) => void;
}) => {
    const handleSelect = (item: ChoiceType) => {
        onSubmit(item.value);
    };
    return (
        <Stack>
            <Text>How do you want to install the dependencies?</Text>
            <SelectInput<string>
                items={choices}
                itemComponent={SelectInputChoice}
                onSelect={handleSelect}
                initialIndex={0}
            />
        </Stack>
    );
};
