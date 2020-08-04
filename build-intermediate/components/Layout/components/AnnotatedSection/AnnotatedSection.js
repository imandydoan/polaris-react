import React from 'react';
import { Heading } from '../../../Heading';
import { TextContainer } from '../../../TextContainer';
import styles from '../../Layout.scss';
export function AnnotatedSection(props) {
    const { children, title, description } = props;
    const descriptionMarkup = typeof description === 'string' ? <p>{description}</p> : description;
    return (<div className={styles.AnnotatedSection}>
      <div className={styles.AnnotationWrapper}>
        <div className={styles.Annotation}>
          <TextContainer>
            <Heading testID="AnnotationTitle">{title}</Heading>
            {descriptionMarkup && (<div className={styles.AnnotationDescription} testID="AnnotationDescription">
                {descriptionMarkup}
              </div>)}
          </TextContainer>
        </div>

        <div className={styles.AnnotationContent}>{children}</div>
      </div>
    </div>);
}
