namespace PortfolioAsk.Api.Auth;

/// <summary>
/// Wheelhouse's Origin check. A browser always sends Origin on a cross-site POST, so a request whose Origin is
/// not this site is turned away: another page cannot spend the budget from its visitors' browsers.
/// Requests without Origin (curl, the deploy's health check) pass, and are still rate limited.
/// </summary>
public static class SameOrigin
{
    public static IApplicationBuilder UseSameOrigin(this IApplicationBuilder app) => app.Use(async (http, next) =>
    {
        var isChange = !(HttpMethods.IsGet(http.Request.Method) || HttpMethods.IsHead(http.Request.Method) || HttpMethods.IsOptions(http.Request.Method));
        if (isChange && http.Request.Headers.Origin.Count > 0)
        {
            var origins = http.Request.Headers.Origin;
            if (origins.Count != 1
                || !Uri.TryCreate(origins[0], UriKind.Absolute, out var origin)
                || origin.PathAndQuery != "/" || origin.Fragment.Length > 0 || origin.UserInfo.Length > 0
                || !Uri.TryCreate($"{http.Request.Scheme}://{http.Request.Host}", UriKind.Absolute, out var site)
                || !string.Equals(origin.GetLeftPart(UriPartial.Authority), site.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
            {
                http.Response.StatusCode = StatusCodes.Status403Forbidden;
                return;
            }
        }

        await next(http);
    });
}
