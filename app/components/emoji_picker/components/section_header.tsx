// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo} from 'react';
import {View} from 'react-native';

import {SECTION_HEADER_HEIGHT} from '@components/emoji_picker';
import FormattedText from '@components/formatted_text';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

const SectionHeader = ({section}: {section: RenderableEmojis}) => {
    const theme = useTheme();
    const styles = getStyleSheetFromTheme(theme);

    return (
        <View
            style={styles.sectionTitleContainer}
            key={section.id}
        >
            <FormattedText
                style={styles.sectionTitle}
                id={section.id}
                defaultMessage={section.icon}
            />
        </View>
    );
};

const getStyleSheetFromTheme = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        sectionTitleContainer: {
            height: SECTION_HEADER_HEIGHT,
            justifyContent: 'center',
            backgroundColor: theme.centerChannelBg,
        },
        sectionTitle: {
            color: changeOpacity(theme.centerChannelColor, 0.2),
            fontSize: 15,
            fontWeight: '700',
        },
    };
});

export default memo(SectionHeader);
