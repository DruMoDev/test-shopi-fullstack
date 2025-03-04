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
import { SaveBar, useAppBridge } from "@shopify/app-bridge-react";

export default function ERPSettings() {
  const [erpData, setErpData] = useState({
    ip: "",
    port: "",
    user: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const bridge = useAppBridge();

  const handleChange = useCallback((newValue, name) => {
    setErpData((prev) => ({ ...prev, [name]: newValue }), []);
  });

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
        bridge.toast.show("ERP credentials saved");
        return result.user;
      }
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await mutateAsync(erpData);
      console.log(res);

      if (res) {
        localStorage.setItem("erp", res._id);
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
            <form data-save-bar onSubmit={handleSubmit}>
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
                    <Icon source={passwordVisible ? HideIcon : ViewIcon} />
                  </Button>
                </InlineStack>
              </FormLayout.Group>
            </form>
          </FormLayout>
        </Card>
      </Layout>
    </Page>
  );
}
