import Image from "next/image";
import styles from "./page.module.css";
import { portfolio, PortfolioItem } from "@/data/portfolio";

export default function Home() {
  return (
    <div
      className={styles.page}
      style={{ display: "flex", alignItems: "flex-start", height: "82vh" }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "70%",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: "#000",
            fontSize: "1.4em",
            fontWeight: 500,
            fontStyle: "italic",
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxHeight: "70vh",
            overflowY: "scroll",
            gap: 10,
            marginTop: 20,
            paddingBottom: 10,
          }}
        >
          {portfolio.map((item: PortfolioItem, index: number) => (
            <div
              key={index}
              style={{
                cursor: "pointer",
              }}
            >
              <Image
                src={item.images[0]}
                alt=""
                width={290}
                height={150}
                style={{
                  borderRadius: 16,
                  boxShadow: "8px 6px 15px -8px rgba(65,65,65,0.87",
                }}
              ></Image>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          maxWidth: "30%",
          color: "#000",
          textAlign: "right",
          fontSize: 14,
          paddingLeft: 20,
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxHeight: "70vh",
          overflowY: "scroll",
        }}
      >
        <p>
          Welcome! I am a 1st AD based in East London. I have worked as an AD
          across continents, collaborating with brands in Italy, the UAE,
          Germany, the Netherlands, and the UK.
        </p>
        <p>
          You can find a full list of my brand collaborations and AD work below:
          they range from the Roundhouse in London, to the Cineteca di Bologna
          in Italy, to the Abu Dhabi Media Company in the UAE.
        </p>
        <p>
          <i>I am currently open to new work.</i>
        </p>

        <p>
          <b>Organised.</b> I keep everything on track while making sure
          creativity has the space it needs to thrive. I have managed schedules
          for teams of over 50 people without a hitch. Every film I have AD-ed
          has wrapped up on time, and with satisfied creative teams.
        </p>
        <p>
          <b>Inclusive.</b> I have been an LGBT activist since I was fifteen, as
          an queer Arab myself. I have worked in anti-racist advocacy, and I am
          trained in disability inclusion. My work is about listening to the
          needs of everyone on set and making sure every crew member is valued
          and motivated.
        </p>
        <p>
          <b>Passionate.</b> I love being part of this industry. I have taught
          film, studied film, and made films since 2014. Films are the most
          powerful tool for inspiring and connecting people: my commitment to
          this field is unwavering.
        </p>
      </div>
    </div>
  );
}
