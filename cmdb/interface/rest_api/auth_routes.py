# DATAGERRY - OpenSource Enterprise CMDB
# Copyright (C) 2019 NETHINKS GmbH
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import logging
from datetime import datetime

from flask import request, abort

from cmdb.interface.route_utils import make_response, RootBlueprint
from cmdb.security.token.generator import TokenGenerator
from cmdb.user_management.user_manager import user_manager

try:
    from cmdb.utils.error import CMDBError
except ImportError:
    CMDBError = Exception


auth_blueprint = RootBlueprint('auth_rest', __name__, url_prefix='/auth')
LOGGER = logging.getLogger(__name__)


@auth_blueprint.route('/providers/', methods=['GET'])
@auth_blueprint.route('/providers', methods=['GET'])
def get_auth_providers():
    from cmdb.user_management import __AUTH_PROVIDERS__
    return make_response(__AUTH_PROVIDERS__)


@auth_blueprint.route('/login', methods=['POST'])
def login_call():
    login_data = request.json
    login_user = None
    login_user_name = login_data['user_name']
    login_password = login_data['password']
    correct = False
    try:
        login_user = user_manager.get_user_by_name(login_user_name)
        auth_method = user_manager.get_authentication_provider(login_user.get_authenticator())
        correct = auth_method.authenticate(
            user=login_user,
            password=login_password
        )
    except CMDBError as e:
        abort(401, e)
    if correct:
        login_user.last_login_time = datetime.utcnow()
        user_manager.update_user(login_user.public_id, login_user.to_database())
        tg = TokenGenerator()
        token = tg.generate_token(payload={'user': {
            'public_id': login_user.get_public_id()
        }})
        login_user.token = token
        login_user.token_issued_at = int(datetime.now().timestamp())
        login_user.token_expire = int(tg.get_expire_time().timestamp())
        return make_response(login_user)
    abort(401)
