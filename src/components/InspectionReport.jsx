import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  Image,
  Svg,
  Path,
  View,
  Link,
} from "@react-pdf/renderer";
import nhraLogo from "../images/NHRA.jpg";
import axios from "axios";
import { setDate } from "date-fns";
const styles = StyleSheet.create({
  page: {
    padding: "2cm",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Times-Bold",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  centerMainPage: {
    paddingTop: "7cm",
    width: "100%",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  centerTextWithPadding: {
    width: "100%",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "1cm",
    paddingBottom: "1cm",
  },
  centerText: {
    width: "100%",
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: "0.5cm",
  },
  centerNHRALogo: {
    width: "20vw",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
    paddingTop: "1cm",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumbers: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  title: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Times-Bold",
  },
  text: {
    fontSize: 12,
    margin: 8,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  resultText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "justify",
    marginTop: 15,
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 12,
    left: 20,
    fontFamily: "Times-Roman",
    textAlign: "justify",
  },
  bulletResultText: {
    fontSize: 12,
    left: 20,
    textAlign: "justify",
    marginBottom: 5,
  },
  boldTitle: {
    fontSize: 13,
    marginTop: 15,
    fontFamily: "Times-Bold",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#4f889f",
    width: "50%",
    height: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: "50%",
    height: 24,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

export default function InspectionReport(props) {
  const [data, setData] = useState();
  const [inspectionTeam, setInspectionTeam] = useState([]);
  const [inspectionResults, setInspectionResults] = useState([]);
  let date = null;

  async function prepareDate() {
    setData(props.pdfData);
    date = new Date(props.pdfData.date);
    setData((prev) => ({ ...prev, date: date }));
  }

  async function fetchInspectionTeam(accessToken) {
    const response = await axios
      .get(props.apiURL + "getInspectionTeam", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        params: {
          inspection_id: props.pdfData.inspection_id,
        },
      })
      .then((response) => {
        setInspectionTeam(response.data.recordset);
      });
  }

  async function fetchInspectionResults(accessToken) {
    const response = await axios
      .get(props.apiURL + "getInspectionResult", {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        params: {
          inspection_id: props.pdfData.inspection_id,
        },
      })
      .then((response) => {
        console.log(response.data.recordset);
        setInspectionResults(response.data.recordset);
      });
  }

  useEffect(() => {
    props.RequestAccessToken();
    if (props.accessToken) {
      async function fetchData() {
        await prepareDate();
        await fetchInspectionTeam(props.accessToken);
        await fetchInspectionResults(props.accessToken);
      }
      fetchData();
    }
  }, [props.accessToken]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.centerMainPage}>
          THE NATIONAL HEALTH REGULATORY AUTHORITY
        </Text>
        <Image src={nhraLogo} style={styles.centerNHRALogo} />
        <Text style={styles.centerTextWithPadding}>
          Pharmacy Inspection Report
        </Text>
        <Text style={styles.centerText}>Pharmacy: {data?.pharmacy_name}</Text>
        <Text style={styles.centerText}>
          License number: {data?.license_number}
        </Text>
        <Text style={styles.centerText}>
          Inspection Date: {data?.date?.toDateString()}
        </Text>
        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) =>
            ` ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <Text fontWeight="bold" style={styles.title}>
          INTRODUCTION
        </Text>
        <Text style={styles.text}>
          The vision of NHRA is to ensure a Safe and High-quality health
          services, we aim to achieve our vision through three strategic goals:
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bulletText}>
            • Regulated and accountable health facilities: Ensure that all
            health care facilities meet the required standards for licensing.
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            • Safe and trusted health services: we encourage and promote
            improvements in the safety and quality of services through the
            regulation and review of health care facilities.
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            • Preserved health rights: we will act to protect the rights of all
            people using the health care facilities.
          </Text>
          <Text> </Text>
          <Text style={styles.text}>
            The NHRA’s inspection standards are derived from laws and
            resolutions regulating provision of pharmacy services, the aim of
            the inspection is to ensure that the pharmacy centre is operating
            according to the rules and conditions stipulated in those
            legislations.
          </Text>
          <Text style={styles.text}>
            The inspection standards provide a framework and emphasize the
            responsibility of all pharmacies to comply with the duty of
            requirements placed on them by the licensing legislations. This
            means that each pharmacy has a legal responsibility for ensuring
            that services it provides meets a required standard.
          </Text>
          <Text style={styles.text}>
            The inspection visits may be announced or unannounced visits, you
            will be receiving a comprehensive inspection report highlighting
            areas for improvement and recommendations.
          </Text>
          <Text style={styles.boldTitle}>REGULATING PHARMACY CENTERS</Text>
          <Text style={styles.text}>
            Pharmacy centers are regulated according to the following laws and
            decisions:
          </Text>
          <Text style={styles.bulletText}>
            •<Text> </Text>
            <Link src="https://www.nhra.bh/Departments/LAU/MediaHandler/GenericHandler/documents/departments/LAU/PPR/PPR000_Law_Legislative%20Decree%20No%20(18)%20for%201997%20With%20Respect%20to%20the%20Practice%20of%20Pharmacists%20and%20Pharmaceutical%20Centers_English.pdf">
              Decree-Law No. (18) of 1997 With Respect to the Practice of
              Pharmacists and Pharmaceutical Centers
            </Link>
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            •<Text> </Text>
            Law No. (15) for 2007 On Narcotic Substances and Psychotropic
            Substance
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            •<Text> </Text>
            Decree-Law No. (20) of 2015 Amending Decree-Law No. (18) of 1997 on
            the Organization of the Pharmacy Profession and Pharmaceutical
            Centers
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            •<Text> </Text>
            <Link src="https://www.nhra.bh/Departments/LAU/MediaHandler/GenericHandler/documents/departments/LAU/PPR/PPR112_Resolution_Resolution%20%20No.%20(63)%20of%202019%20on%20Requirements%20and%20Procedures%20for%20Practicing%20Pharmacy%20Professions%20and%20Licensing%20of%20Pharmaceutical%20Facilities_English.pdf">
              Resolution No. (63) of 2019 On Requirements and Procedures for
              Practicing Pharmacy Professions and Licensing of Pharmaceutical
              Facilities
            </Link>
          </Text>
          <Text> </Text>
          <Text style={styles.bulletText}>
            •<Text> </Text>
            Resolution No. (71) of 2019 On Regulating Pharmaceutical Products
            Containing (Gapapentinoid) Medicine Group (Arabic)
          </Text>
          <Text> </Text>
          <Text style={styles.text}>
            Pharmacy center management and staff should be fully aware of the
            above regulations that governs their practice and operations.
          </Text>
          <Text> </Text>
        </View>

        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) =>
            ` ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <Text style={styles.boldTitle}>THE INSPECTION PROCESS</Text>
        <Text> </Text>
        <Text style={styles.text}>
          NHRA inspection team will conduct an unannounced or announced visit to
          the pharmacy were they will be inspecting the compliance of the
          pharmacy center and the staff working in it to the rules and
          conditions stipulated in the regulations, where each required standard
          degree of compliance will be assessed as follows:
        </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          Fully complaint
        </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          Partially compliant
        </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          Non-complaint
        </Text>
        <Text style={styles.text}>
          After the inspection is completed, the inspectors will give brief
          findings. The full report will be sent in one-week time with full
          findings and required corrections.
        </Text>
        <Text style={styles.text}>
          Violation related to pricing or controlled or semi controlled drugs or
          violation to the license will be escalated to the CEO for further
          legal or disciplinary actions according to the law.
        </Text>
        <Text style={styles.text}>
          As a result of the inspection, there may be issues identified which
          require follow up action to be taken by the pharmacy.
        </Text>
        <Text style={styles.boldTitle}>IMPROVEMENT PLAN</Text>
        <Text> </Text>
        <Text style={styles.text}>
          The pharmacy manger is expected to develop an improvement plan to
          ensure appropriate steps are taken to address areas of partial or
          non-compliance. The improvement plan should be submitted to the NHRA
          within two weeks of receiving the report. Further visits will be
          undertaken in the future.
        </Text>
        <Text> </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          The pharmacy will be given a 2 weeks’ notice letter indicating the
          immediate action to be taken.
        </Text>
        <Text> </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          The pharmacy manager must sign a Pledge letter to ensure commitment to
          carry out the improvement required.
        </Text>
        <Text> </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>A time frame will be granted to carry out the
          improvement based on the size and type of the required improvements.
        </Text>
        <Text> </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          If the pharmacy did not take the necessary action the license will not
          be renewed, and the necessary legal penalty should be taken as stated
          in law number 18 of the year 1997 regulating the practice of
          pharmacist and pharmacy centers and its amendments by law no. 20 for
          2015.
        </Text>
        <Text> </Text>
        <Text style={styles.bulletText}>
          •<Text> </Text>
          NHRA may decide to close or stop the violated services in the facility
          until improvement is taken place within the agreed time frame.
        </Text>
        <Text> </Text>
        <Text style={styles.text}>
          A follow up inspection visit may be scheduled with the pharmacy to
          follow up compliance.
        </Text>
        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) =>
            ` ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <Text fontWeight="bold" style={styles.title}>
          THE INSPECTION TEAM
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.tableCell, color: "white" }}>Name</Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={{ ...styles.tableCell, color: "white" }}>
                Position
              </Text>
            </View>
          </View>

          {inspectionTeam.map((item, index) => {
            return (
              <View style={styles.tableRow}>
                <View key={index} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.inspector_name}</Text>
                </View>
                <View key={index} style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.inspector_position}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <Text style={styles.text}></Text>
        <Text fontWeight="bold" style={styles.title}>
          INSPECTION FINDINGS
        </Text>
        <Text style={styles.text}>
          The following section outline areas of compliance in each of the
          standards:
        </Text>

        {inspectionResults.map((item, index) => {
          return (
            <View>
              <Text
                style={{
                  ...styles.resultText,
                  fontFamily: "Times-Bold",
                  color: "#36454F",
                }}
              >
                {item.Element} {item.standard}
              </Text>
              <Text style={styles.bulletResultText}>
                -<Text> </Text>
                <Text style={{ fontFamily: "Times-Bold" }}>
                  Compliant Status:
                </Text>{" "}
                <Text
                  style={{
                    color:
                      item.compliant_status_id == 1
                        ? "green"
                        : item.compliant_status_id == 2
                        ? "#E1AD01"
                        : "red",
                  }}
                >
                  {item.compliant_status}
                </Text>
              </Text>
              <Text style={styles.bulletResultText}>
                -<Text> </Text>
                Notes: {item.memo}
              </Text>
            </View>
          );
        })}

        <Text
          style={styles.pageNumbers}
          render={({ pageNumber, totalPages }) =>
            ` ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>VIOLATIONS TO BE CORRECTED</Text>

        {inspectionResults
          .filter((item) => item.compliant_status_id !== 1)
          .map((item, index) => (
            <View>
              <Text style={{...styles.resultText, color: "#36454F"}}>
                {item.Element} {item.standard}
              </Text>
              <Text style={styles.bulletResultText}>
                -<Text> </Text>
                Compliant Status:{" "}
                <Text
                  style={{
                    color:
                      item.compliant_status_id == 1
                        ? "green"
                        : item.compliant_status_id == 2
                        ? "#E1AD01"
                        : "red",
                  }}
                >
                  {item.compliant_status}
                </Text>
              </Text>
              <Text style={styles.bulletResultText}>
                -<Text> </Text>
                Notes: {item.memo}
              </Text>
            </View>
          ))}
      </Page>
    </Document>
  );
}
