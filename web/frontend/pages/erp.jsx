import {
  Page,
  FormLayout,
  TextField,
  Card,
  Icon,
  Layout,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { ViewIcon, HideIcon } from "@shopify/polaris-icons";
import { useMutation } from "react-query";

export default function ERPSettings() {
  const [erpData, setErpData] = useState({
    ip: "",
    port: "",
    user: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = useCallback((newValue, name) =>
    setErpData((prev) => ({ ...prev, [name]: newValue }), [])
  );

  const { mutateAsync } = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/erp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al guardar el ERP");
      }
      if (response.ok) {
        const result = await response.json();

        alert(result.msg);
        return result.user;
      }
    },
  });

  const handleSubmit = async () => {
    try {
      const res = await mutateAsync(erpData);
      if (res?.user?._id) {
        localStorage.setItem("erp", res.user._id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getErpData = async () => {
      const userId = localStorage.getItem("erp");

      if (userId === "undefined" || !userId) return;

      const url = `/api/erp/${userId}`;
      const res = await fetch(url);
      if (res.status !== 200) {
        throw new Error("Error al obtener los ERP Data");
      }
      const data = await res.json();
      const newErp = { ...erpData, ...data };
      setErpData(newErp);
    };

    // He hecho la persistencia con el localstorage por mantenerlo simple, pero deberiamos acceder con otros datos del usuario registrado
    getErpData();
  }, []);

  return (
    <Page title="ERP settings" narrowWidth>
      <Layout>
        <Card>
          <FormLayout>
            <FormLayout.Group>
              <TextField
                label="IP"
                value={erpData.ip}
                name="ip"
                onChange={(e) => handleChange(e, "ip")}
                autoComplete="ip"
                type="text"
                clearButton
                inputMode="numeric"
              />
              <TextField
                label="Port"
                value={erpData.port}
                onChange={(e) => handleChange(e, "port")}
                autoComplete="port"
                type="text"
                clearButton
                inputMode="numeric"
              />
            </FormLayout.Group>

            <FormLayout.Group>
              <TextField
                label="User"
                value={erpData.user}
                onChange={(e) => handleChange(e, "user")}
                autoComplete="user"
                type="text"
                clearButton
              />
              <InlineStack blockAlign="end" gap={"100"}>
                <TextField
                  type={passwordVisible ? "text" : "password"}
                  label="Password"
                  value={erpData.password}
                  onChange={(e) => handleChange(e, "password")}
                  autoComplete="password"
                />
                <Button onClick={() => setPasswordVisible(!passwordVisible)}>
                  <Icon source={ViewIcon} />
                </Button>
              </InlineStack>
            </FormLayout.Group>
            <Button onClick={handleSubmit}>Guardar ERP</Button>
          </FormLayout>
        </Card>
      </Layout>
    </Page>
  );
}
