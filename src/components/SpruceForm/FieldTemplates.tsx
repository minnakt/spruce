import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { ArrayFieldTemplateProps, FieldTemplateProps } from "@rjsf/core";
import Icon from "components/Icon";
import ElementWrapper from "./ElementWrapper";

// Custom field template that does not render fields' titles, as this is handled by LeafyGreen widgets
export const DefaultFieldTemplate: React.FC<FieldTemplateProps> = ({
  classNames,
  children,
}) => <div className={classNames}>{children}</div>;

export const ArrayFieldTemplate: React.FC<ArrayFieldTemplateProps> = ({
  canAdd,
  DescriptionField,
  idSchema,
  items,
  onAddClick,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
}) => {
  const id = idSchema.$id;
  const description = uiSchema["ui:description"] || schema.description;
  return (
    <>
      <TitleField id={`${id}__title`} required={required} title={title} />
      {description && (
        <DescriptionField id={`${id}__description`} description={description} />
      )}
      {canAdd && (
        <ElementWrapper>
          <Button
            leftGlyph={<Icon glyph="Plus" />}
            onClick={onAddClick}
            size="small"
          >
            Add File Pattern
          </Button>
        </ElementWrapper>
      )}
      <ArrayContainer>
        {items.map(({ children, hasRemove, index, onDropIndexClick }) => (
          <ArrayItemRow key={index}>
            {children}
            {hasRemove && (
              <DeleteButtonWrapper>
                <Button onClick={onDropIndexClick(index)}>
                  <Icon glyph="Trash" />
                </Button>
              </DeleteButtonWrapper>
            )}
          </ArrayItemRow>
        ))}
      </ArrayContainer>
    </>
  );
};

const ArrayContainer = styled.div`
  min-width: min-content;
  width: 60%;
`;

const ArrayItemRow = styled.div`
  align-items: flex-end;
  display: flex;

  .field-object {
    flex-grow: 1;
  }
`;

const DeleteButtonWrapper = styled(ElementWrapper)`
  margin-left: 16px;
`;