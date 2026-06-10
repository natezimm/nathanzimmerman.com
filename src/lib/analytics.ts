type AnalyticsValue = string | number | boolean | null | undefined;

export type PortfolioEventProperties = Record<string, AnalyticsValue>;

export type PortfolioEventName =
  | 'contact_link_click'
  | 'contact_submit_failure'
  | 'contact_submit_success'
  | 'map_destination_open'
  | 'project_code_click'
  | 'project_details_click'
  | 'project_live_click'
  | 'resume_click'
  | 'social_link_click'
  | 'view_mode_change';

type AnalyticsWindow = Window & {
  gtag?: (
    command: 'event',
    eventName: PortfolioEventName,
    properties?: PortfolioEventProperties
  ) => void;
  plausible?: (
    eventName: PortfolioEventName,
    options?: { props?: PortfolioEventProperties }
  ) => void;
};

export const trackPortfolioEvent = (
  name: PortfolioEventName,
  properties: PortfolioEventProperties = {}
) => {
  if (typeof window === 'undefined') return;

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dispatchEvent(
    new CustomEvent('portfolio-analytics', {
      detail: { name, properties },
    })
  );
  analyticsWindow.gtag?.('event', name, properties);
  analyticsWindow.plausible?.(name, { props: properties });
};
