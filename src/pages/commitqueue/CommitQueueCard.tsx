import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { StyledLink, StyledRouterLink } from "components/styles";
import { getGithubPullRequestUrl } from "constants/externalResources";
import { getVersionRoute } from "constants/routes";
import { size, fontSize } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  ModuleCodeChangeFragment,
  RemoveItemFromCommitQueueMutation,
  RemoveItemFromCommitQueueMutationVariables,
} from "gql/generated/types";
import { REMOVE_ITEM_FROM_COMMIT_QUEUE } from "gql/mutations";
import { useDateFormat } from "hooks";

import { CodeChangeModule } from "./codeChangesModule/CodeChangesModule";
import { ConfirmPatchButton } from "./ConfirmPatchButton";

interface Props {
  issue: string;
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  patchId: string;
  versionId: string;
  owner: string;
  repo: string;
  moduleCodeChanges: ModuleCodeChangeFragment[];
  commitQueueId: string;
  activated: boolean;
}
const { gray } = palette;

export const CommitQueueCard: React.VFC<Props> = ({
  issue,
  index,
  title,
  author,
  commitTime,
  patchId,
  versionId,
  owner,
  repo,
  moduleCodeChanges,
  commitQueueId,
  activated,
}) => {
  const dispatchToast = useToastContext();
  const getDateCopy = useDateFormat();
  const [removeItemFromCommitQueue, { loading }] = useMutation<
    RemoveItemFromCommitQueueMutation,
    RemoveItemFromCommitQueueMutationVariables
  >(REMOVE_ITEM_FROM_COMMIT_QUEUE, {
    onCompleted: () => {
      dispatchToast.success("Successfully removed item from commit queue");
    },
    onError: (err) => {
      dispatchToast.error(`Error removing item from commit queue ${err}`);
    },
  });
  const handleEnroll = () => {
    removeItemFromCommitQueue({
      variables: { issue, commitQueueId },
      refetchQueries: ["CommitQueue"],
    });
  };
  return (
    <Card data-cy="commit-queue-card">
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        {patchId ? (
          <CommitInfo>
            <ConditionalWrapper
              condition={
                !!versionId || issue === "" || Number.isNaN(Number(issue))
              }
              wrapper={(c) =>
                activated ? (
                  <CardTitleLink
                    data-cy="commit-queue-card-title"
                    to={getVersionRoute(patchId)}
                  >
                    {c}
                  </CardTitleLink>
                ) : (
                  <CardTitle data-cy="commit-queue-card-title">{c}</CardTitle>
                )
              }
              altWrapper={(c) => (
                <PRCardTitle
                  data-cy="commit-queue-card-title"
                  href={getGithubPullRequestUrl(owner, repo, issue)}
                >
                  {c}
                </PRCardTitle>
              )}
            >
              {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
              <>{title}</>
            </ConditionalWrapper>
            <CardMetaData>
              By <b>{author}</b> on {getDateCopy(commitTime)}
            </CardMetaData>
            <Container>
              {moduleCodeChanges?.map((moduleCodeChange) => (
                <CodeChangeModule
                  key={moduleCodeChange.rawLink}
                  moduleCodeChange={moduleCodeChange}
                />
              ))}
            </Container>
          </CommitInfo>
        ) : (
          // should only get here for pull requests not processed yet (ie. added in the past minute)
          <CommitInfo>
            <PRCardTitle href={getGithubPullRequestUrl(owner, repo, issue)}>
              Pull Request #{issue}
            </PRCardTitle>
          </CommitInfo>
        )}
        <CommitQueueCardActions>
          <ConfirmPatchButton
            disabled={loading}
            onConfirm={handleEnroll}
            commitTitle={title}
          />
        </CommitQueueCardActions>
      </CommitQueueCardGrid>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  margin-top: ${size.s};
  width: 100%;
`;

const cardTitleStyles = css`
  margin-bottom: ${size.s};
  font-size: ${fontSize.l};
  font-weight: bold;
`;

const CardTitle = styled.span`
  ${cardTitleStyles}
`;

const CardTitleLink = styled(StyledRouterLink)`
  ${cardTitleStyles}
`;

const PRCardTitle = styled(StyledLink)`
  ${cardTitleStyles}
`;

const CommitInfo = styled.div`
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1 / 2 / 2;
  margin-left: ${size.s};
  margin-bottom: ${size.m};
  width: 100%;
`;
const CardMetaData = styled(Body)`
  color: ${gray.dark2};
`;

const CommitQueueCardGrid = styled.div`
  border-bottom: 1px solid ${gray.light2};
  display: grid;
  grid-template-columns: 4fr repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
`;

const CommitQueueCardActions = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;

const Container = styled.div`
  padding-top: ${size.m};
`;
