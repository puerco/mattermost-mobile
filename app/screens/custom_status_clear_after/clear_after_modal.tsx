// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import withObservables from '@nozbe/with-observables';
import React from 'react';
import {injectIntl, IntlShape} from 'react-intl';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
    Navigation,
    NavigationButtonPressedEvent,
    NavigationComponent,
    NavigationComponentProps,
    Options,
} from 'react-native-navigation';
import {switchMap} from 'rxjs/operators';

import {CustomStatusDuration} from '@constants/custom_status';
import {MM_TABLES, SYSTEM_IDENTIFIERS} from '@constants/database';
import {mergeNavigationOptions, popTopScreen} from '@screens/navigation';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import ClearAfterMenuItem from './components/clear_after_menu_item';

import type {WithDatabaseArgs} from '@typings/database/database';
import type SystemModel from '@typings/database/models/servers/system';
import type UserModel from '@typings/database/models/servers/user';

const {SERVER: {SYSTEM, USER}} = MM_TABLES;

interface Props extends NavigationComponentProps {
    currentUser: UserModel;
    handleClearAfterClick: (duration: CustomStatusDuration, expiresAt: string) => void;
    initialDuration: CustomStatusDuration;
    intl: IntlShape;
    theme: Theme;
}

type State = {
    duration: CustomStatusDuration;
    expiresAt: string;
    showExpiryTime: boolean;
}

class ClearAfterModal extends NavigationComponent<Props, State> {
    static options(): Options {
        return {
            topBar: {
                title: {
                    alignment: 'center',
                },
            },
        };
    }

    constructor(props: Props) {
        super(props);

        const options: Options = {
            topBar: {
                rightButtons: [{
                    color: props.theme.sidebarHeaderTextColor,
                    enabled: true,
                    id: 'update-custom-status-clear-after',
                    showAsAction: 'always',
                    testID: 'clear_after.done.button',
                    text: props.intl.formatMessage({
                        id: 'mobile.custom_status.modal_confirm',
                        defaultMessage: 'Done',
                    }),
                }],
            },
        };

        mergeNavigationOptions(props.componentId, options);

        this.state = {
            duration: props.initialDuration,
            expiresAt: '',
            showExpiryTime: false,
        };
    }

    componentDidMount() {
        Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({buttonId}: NavigationButtonPressedEvent) {
        switch (buttonId) {
            case 'update-custom-status-clear-after':
                this.onDone();
                break;
        }
    }

    onDone = () => {
        this.props.handleClearAfterClick(this.state.duration, this.state.expiresAt);
        popTopScreen();
    };

    handleItemClick = (duration: CustomStatusDuration, expiresAt: string) =>
        this.setState({
            duration,
            expiresAt,
            showExpiryTime: duration === CustomStatusDuration.DATE_AND_TIME && expiresAt !== '',
        });

    renderClearAfterMenu = () => {
        const {currentUser, theme} = this.props;
        const style = getStyleSheet(theme);

        const {duration} = this.state;

        const clearAfterMenu = Object.values(CustomStatusDuration).map(
            (item, index, arr) => {
                if (index === arr.length - 1) {
                    return null;
                }

                return (
                    <ClearAfterMenuItem
                        currentUser={currentUser}
                        duration={item}
                        handleItemClick={this.handleItemClick}
                        isSelected={duration === item}
                        key={item}
                        separator={index !== arr.length - 2}
                    />
                );
            },
        );

        if (clearAfterMenu.length === 0) {
            return null;
        }

        return (
            <View testID='clear_after.menu'>
                <View style={style.block}>{clearAfterMenu}</View>
            </View>
        );
    };

    render() {
        const {currentUser, theme} = this.props;
        const style = getStyleSheet(theme);
        const {duration, expiresAt, showExpiryTime} = this.state;
        return (
            <SafeAreaView
                style={style.container}
                testID='clear_after.screen'
            >
                <StatusBar/>
                <KeyboardAwareScrollView bounces={false}>
                    <View style={style.scrollView}>
                        {this.renderClearAfterMenu()}
                    </View>
                    <View style={style.block}>
                        <ClearAfterMenuItem
                            currentUser={currentUser}
                            duration={CustomStatusDuration.DATE_AND_TIME}
                            expiryTime={expiresAt}
                            handleItemClick={this.handleItemClick}
                            isSelected={duration === CustomStatusDuration.DATE_AND_TIME && expiresAt === ''}
                            separator={false}
                            showDateTimePicker={duration === CustomStatusDuration.DATE_AND_TIME}
                            showExpiryTime={showExpiryTime}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme: Theme) => {
    return {
        container: {
            flex: 1,
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.03),
        },
        scrollView: {
            flex: 1,
            paddingTop: 32,
            paddingBottom: 32,
        },
        block: {
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderBottomWidth: 1,
            borderTopColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderTopWidth: 1,
        },
    };
});

const enhancedCFM = withObservables([], ({database}: WithDatabaseArgs) => ({
    currentUser: database.get(SYSTEM).findAndObserve(SYSTEM_IDENTIFIERS.CURRENT_USER_ID).pipe(switchMap((id: SystemModel) => database.get(USER).findAndObserve(id.value))),
}));

export default enhancedCFM(injectIntl(ClearAfterModal));
