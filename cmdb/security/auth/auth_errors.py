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
from cmdb.utils.error import CMDBError


class AuthenticationError(CMDBError):

    def __init__(self, provider_name: str, error=None):
        self.message = f'Could not authenticate via provider: {provider_name} - error message: {error}'


class NoValidAuthenticationProviderError(CMDBError):
    """Exception if auth provider do not exist"""

    def __init__(self, authenticator):
        self.message = f'The Provider {authenticator} is not a valid authentication-provider'


class NotPasswordAbleError(CMDBError):
    """Exception if application tries to generate a password for an not password_able class"""

    def __init__(self, provider):
        self.message = f'The AuthenticationProvider {provider} is not password able'
