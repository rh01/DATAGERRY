import calendar
import datetime
import re

try:
    import uuid

    _use_uuid = True
except ImportError:
    _use_uuid = False

from bson.dbref import DBRef
from bson.max_key import MaxKey
from bson.min_key import MinKey
from bson.objectid import ObjectId
from bson.timestamp import Timestamp

_RE_TYPE = type(re.compile("foo"))


def default(obj):
    from cmdb.object_framework import CmdbDAO
    from cmdb.user_management import UserManagementBase
    from cmdb.user_management.user_right import BaseRight
    from cmdb.object_framework.cmdb_render import RenderResult
    """Helper function for converting cmdb objects to json"""
    if isinstance(obj, CmdbDAO):
        return obj.__dict__
    if isinstance(obj, UserManagementBase):
        return obj.__dict__
    if isinstance(obj, BaseRight):
        return obj.__dict__
    if isinstance(obj, RenderResult):
        return obj.to_json()
    if isinstance(obj, bytes):
        return obj.decode("utf-8")
    if isinstance(obj, ObjectId):
        return {"$oid": str(obj)}
    if isinstance(obj, DBRef):
        return obj.as_doc()
    if isinstance(obj, datetime.datetime):
        if obj.utcoffset() is not None:
            obj = obj - obj.utcoffset()
        millis = int(calendar.timegm(obj.timetuple()) * 1000 +
                     obj.microsecond / 1000)
        return {"$date": millis}
    if isinstance(obj, _RE_TYPE):
        flags = ""
        if obj.flags & re.IGNORECASE:
            flags += "i"
        if obj.flags & re.MULTILINE:
            flags += "m"
        return {"$regex": obj.pattern,
                "$options": flags}
    if isinstance(obj, MinKey):
        return {"$minKey": 1}
    if isinstance(obj, MaxKey):
        return {"$maxKey": 1}
    if isinstance(obj, dict):
        return obj
    if isinstance(obj, Timestamp):
        return {"t": obj.time, "i": obj.inc}
    if _use_uuid and isinstance(obj, uuid.UUID):
        return {"$uuid": obj.hex}
    raise TypeError("{} is not JSON serializable - type: {}".format(obj, type(obj)))