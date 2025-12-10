import React, { useEffect, useState } from "react";
import { getItemsService } from "../../common/services";
import lists from "../../common/lists";
import { handleError } from "../../common/helpers";
import PropTypes from "prop-types";

export default function PermissionName({ systemObjectRcd }) {
  const [name, setName] = useState([]);

  useEffect(() => {
    const fetchPermissionName = async () => {
      if (!systemObjectRcd) return;

      try {
        const result = await getItemsService(lists.SystemObjectVisibles, {
          filter: `SystemObjectRcd eq '${systemObjectRcd}'`,
        });

        const fetchedName = result.value[0]?.SystemObjectName;
        setName(fetchedName);
      } catch (error) {
        handleError(error);
        setName(systemObjectRcd);
      }
    };

    fetchPermissionName();
  }, [systemObjectRcd]);

  return <span>{name}</span>;
}

PermissionName.propTypes = {
  systemObjectRcd: PropTypes.string,
};
