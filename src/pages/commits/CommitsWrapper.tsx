import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { PageWrapper } from "components/styles";
import { MainlineCommitsQuery } from "gql/generated/types";
import { GroupedResult } from "pages/commits/commitChart/utils";

export const CommitsWrapper: React.FC<{
  versions: MainlineCommitsQuery["mainlineCommits"]["versions"];
  error?: ApolloError;
  isLoading: boolean;
}> = ({ versions, isLoading, error }) => {
  if (error) {
    return <PageWrapper>ERROR</PageWrapper>;
  }
  if (isLoading) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 6 }} />;
  }
  if (!isLoading && versions?.length !== 0) {
    return <FlexRowContainer />;
  }
  return <NoResults data-cy="no-commits-found">No commits found</NoResults>;
};

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

export const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  height: 222px;
  width: 100%;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;

export function findMaxGroupedTaskStats(groupedTaskData: GroupedResult[]) {
  const maxes = groupedTaskData.map((data) => data.max);
  return Math.max(...maxes);
}