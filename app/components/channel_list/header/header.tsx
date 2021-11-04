// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Text, View} from 'react-native';

import {useServerDisplayName} from '@app/context/server_display_name';
import CompassIcon from '@components/compass_icon';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {useTheme} from '@context/theme';
import TeamModel from '@typings/database/models/servers/team';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

const getStyles = makeStyleSheetFromTheme((theme: Theme) => ({
    headingStyles: {
        color: theme.sidebarText,
        ...typography('Heading', 700),
    },
    subHeadingStyles: {
        color: changeOpacity(theme.sidebarText, 0.64),
        ...typography('Heading', 50),
    },
    iconPad: {
        marginLeft: 44,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chevronButton: {
        marginLeft: 4,
    },
    chevronIcon: {
        color: changeOpacity(theme.sidebarText, 0.8),
        fontSize: 24,
    },
    plusButton: {
        backgroundColor: changeOpacity(theme.sidebarText, 0.08),
        height: 28,
        width: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusIcon: {
        color: changeOpacity(theme.sidebarText, 0.8),
        fontSize: 18,
    },
}));

type Props = {
    team: TeamModel;
    iconPad?: boolean;
}

const ChannelListHeader = ({team, iconPad}: Props) => {
    // Styles
    const theme = useTheme();
    const styles = getStyles(theme);

    // Hooks
    const serverName = useServerDisplayName();

    return (
        <View style={iconPad && styles.iconPad}>
            <View style={styles.headerRow}>
                <View style={styles.headerRow}>
                    <Text style={styles.headingStyles}>
                        {team.displayName}
                    </Text>
                    <TouchableWithFeedback style={styles.chevronButton}>
                        <CompassIcon
                            style={styles.chevronIcon}
                            name={'chevron-down'}
                        />
                    </TouchableWithFeedback>
                </View>
                <TouchableWithFeedback style={styles.plusButton}>
                    <CompassIcon
                        style={styles.plusIcon}
                        name={'plus'}
                    />
                </TouchableWithFeedback>
            </View>
            <Text style={styles.subHeadingStyles}>
                {serverName}
            </Text>
        </View>
    );
};

export default ChannelListHeader;
