// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Text, View} from 'react-native';

import {useTheme} from '@app/context/theme';
import {typography} from '@app/utils/typography';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => ({
    container: {
        paddingVertical: 8,
        marginTop: 12,
    },
    heading: {
        color: changeOpacity(theme.sidebarText, 0.64),
    },
}));

type Props = {
    heading: string;
}

const CategoriesHeader = (props: Props) => {
    const theme = useTheme();
    const styles = getStyleSheet(theme);

    return (
        <View style={styles.container}>
            <Text style={[typography('Heading', 75), styles.heading]}>
                {props.heading.toUpperCase()}
            </Text>
        </View>
    );
};

export default CategoriesHeader;