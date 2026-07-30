"""
URL configuration for iles_backend project.
"""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def home(request):
    return JsonResponse(
        {
            "status": "success",
            "message": "ILES backend is running",
        }
    )


# Safe/guarded import: avoid failing project import if IssueViewSet is missing or broken.
try:
    from rest_framework.routers import DefaultRouter
    from issues.views import IssueViewSet

    _issue_viewset_available = True
except Exception:
    IssueViewSet = None
    _issue_viewset_available = False


router = DefaultRouter()

if _issue_viewset_available and IssueViewSet is not None:
    router.register(r"issues", IssueViewSet, basename="issue")


urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/users/", include("users.urls")),
    path("api/issues/", include("issues.urls")),
]
