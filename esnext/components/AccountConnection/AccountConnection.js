import React from 'react';
import { Avatar } from '../Avatar';
import { buttonFrom } from '../Button';
import { Card } from '../Card';
import { Stack } from '../Stack';
import { TextStyle } from '../TextStyle';
import { SettingAction } from '../SettingAction';
import styles from './AccountConnection.scss';
export function AccountConnection({ connected = false, action, avatarUrl, accountName = '', title, details, termsOfService, }) {
    const initials = accountName
        ? accountName
            .split(/\s+/)
            .map((name) => name[0])
            .join('')
        : undefined;
    const avatarMarkup = connected ? (<Avatar accessibilityLabel="" name={accountName} initials={initials} source={avatarUrl}/>) : null;
    let titleMarkup = null;
    if (title) {
        titleMarkup = <div>{title}</div>;
    }
    else if (accountName) {
        titleMarkup = <div>{accountName}</div>;
    }
    const detailsMarkup = details ? (<div>
      <TextStyle variation="subdued">{details}</TextStyle>
    </div>) : null;
    const termsOfServiceMarkup = termsOfService ? (<div className={styles.TermsOfService}>{termsOfService}</div>) : null;
    const actionElement = action
        ? buttonFrom(action, { primary: !connected })
        : null;
    return (<Card sectioned>
      <SettingAction action={actionElement}>
        <Stack>
          {avatarMarkup}
          <Stack.Item fill>
            <div className={styles.Content}>
              {titleMarkup}
              {detailsMarkup}
            </div>
          </Stack.Item>
        </Stack>
      </SettingAction>
      {termsOfServiceMarkup}
    </Card>);
}
