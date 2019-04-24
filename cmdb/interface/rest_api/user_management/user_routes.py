import logging

from flask import abort
from cmdb.utils.interface_wraps import login_required
from cmdb.interface.route_utils import RootBlueprint, make_response
from cmdb.user_management.user_manager import user_manager

try:
    from cmdb.utils.error import CMDBError
except ImportError:
    CMDBError = Exception

LOGGER = logging.getLogger(__name__)
user_routes = RootBlueprint('user_rest', __name__, url_prefix='/user')


@login_required
@user_routes.route('/', methods=['GET'])
def get_users():
    try:
        users = user_manager.get_all_users()
    except CMDBError:
        return abort(404)

    resp = make_response(users)
    return resp


@login_required
@user_routes.route('/<int:public_id>', methods=['GET'])
def get_user(public_id):
    try:
        user = user_manager.get_user(public_id=public_id)
    except CMDBError:
        return abort(404)

    resp = make_response(user)
    return resp


@login_required
@user_routes.route('/', methods=['POST'])
def add_user():
    raise NotImplementedError


@login_required
@user_routes.route('/<int:public_id>', methods=['PUT'])
def update_user(public_id: int):
    raise NotImplementedError


@login_required
@user_routes.route('/<int:public_id>', methods=['DELETE'])
def delete_user(public_id: int):
    raise NotImplementedError