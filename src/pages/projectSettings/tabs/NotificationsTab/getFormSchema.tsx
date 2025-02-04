import { InlineCode, Description } from "@leafygreen-ui/typography";
import {
  getEventSchema,
  getNotificationSchema,
} from "components/Notifications/form";
import { CardFieldTemplate } from "components/SpruceForm/FieldTemplates";
import widgets from "components/SpruceForm/Widgets";
import { projectTriggers } from "constants/triggers";
import { useSpruceConfig } from "hooks";
import { projectSubscriptionMethods as subscriptionMethods } from "types/subscription";
import { GetFormSchema } from "../types";
import { radioBoxOptions } from "../utils/form";
import { FormState } from "./types";

export const getFormSchema = (
  repoData?: FormState
): ReturnType<GetFormSchema> => {
  const { schema: eventSchema, uiSchema: eventUiSchema } = getEventSchema(
    [],
    projectTriggers
  );
  const { schema: notificationSchema, uiSchema: notificationUiSchema } =
    getNotificationSchema(subscriptionMethods);

  return {
    fields: {},
    schema: {
      type: "object" as "object",
      properties: {
        buildBreakSettings: {
          type: "object" as "object",
          title: "Performance Plugins",
          properties: {
            notifyOnBuildFailure: {
              type: ["boolean", "null"],
              title: "Build Break Notifications",
              oneOf: radioBoxOptions(
                ["Enabled", "Disabled"],
                repoData?.buildBreakSettings?.notifyOnBuildFailure
              ),
            },
          },
        },
        subscriptions: {
          type: "array" as "array",
          title: "Subscriptions",
          items: {
            type: "object" as "object",
            properties: {
              subscriptionData: {
                type: "object" as "object",
                title: "",
                properties: {
                  event: eventSchema,
                  notification: notificationSchema,
                },
              },
            },
          },
        },
      },
    },
    uiSchema: {
      buildBreakSettings: {
        "ui:rootFieldId": "plugins",
        "ui:ObjectFieldTemplate": CardFieldTemplate,
        notifyOnBuildFailure: {
          "ui:widget": widgets.RadioBoxWidget,
          "ui:description":
            "Send notification of build breaks to admins of a project if the commit author is not signed up to receive notifications.",
        },
      },
      subscriptions: {
        "ui:placeholder": "No subscriptions are defined.",
        "ui:descriptionNode": <HelpText />,
        "ui:addButtonText": "Add Subscription",
        "ui:orderable": false,
        "ui:useExpandableCard": true,
        items: {
          "ui:displayTitle": "New Subscription",
          subscriptionData: {
            event: eventUiSchema,
            notification: notificationUiSchema,
          },
        },
      },
    },
  };
};

const HelpText: React.VFC = () => {
  const spruceConfig = useSpruceConfig();
  const slackName = spruceConfig?.slack?.name;

  return (
    <Description>
      Private slack channels may require further Slack configuration.
      {slackName && (
        <div>
          Invite evergreen to your private Slack channels by running{" "}
          <InlineCode>invite {slackName}</InlineCode> in the channel.
        </div>
      )}
    </Description>
  );
};
