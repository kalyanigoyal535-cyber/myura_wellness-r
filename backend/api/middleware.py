from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)


class EnsureSessionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            if hasattr(request, 'session'):
                _ = request.session.get('_loaded', None)
                if not request.session.session_key:
                    request.session.create()
                    logger.info(f"[Middleware] Created new session for {request.path}")
                else:
                    logger.debug(f"[Middleware] Loaded existing session: {request.session.session_key[:10]}... for {request.path}")
    
    def process_response(self, request, response):
        if request.path.startswith('/api/'):
            if hasattr(request, 'session') and request.session.session_key:
                if request.session.modified or not request.user.is_authenticated:
                    request.session.save()
                    session_key_short = request.session.session_key[:10] if request.session.session_key else 'None'
                    logger.info(f"[Middleware] Saved session: {session_key_short}... for {request.path}")
                    
                    set_cookie_header = response.get('Set-Cookie', None)
                    if set_cookie_header:
                        logger.debug(f"[Middleware] Set-Cookie header present: {set_cookie_header[:50]}...")
                    else:
                        logger.warning(f"[Middleware] WARNING: No Set-Cookie header in response for {request.path}")
                        from django.conf import settings
                        from django.http import HttpResponse
                        
                        cookie_name = getattr(settings, 'SESSION_COOKIE_NAME', 'sessionid')
                        logger.warning(f"[Middleware] Session cookie may not be set. Session key: {session_key_short}...")
        return response

