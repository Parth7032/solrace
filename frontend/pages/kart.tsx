import { toast } from "react-toastify";
import AppLayout from "~/app/AppLayout";
import { useAllNFT } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import styled from "styled-components";

import { useWorkspace } from "~/workspace/hooks";
import { mint } from "~/mint/services";
import Title from "~/ui/title/Title";
import Button from "~/ui/button/Button";
import { Paragraph, Row } from "~/ui";
import { usePoolAccount } from "~/hooks/useAccount";
import KartCard from "~/kart/KartCard";
import { useWallet } from "@solana/wallet-adapter-react";
import ConnectWalletButton from "~/wallet/ConnectWalletButton";
import { usePool } from "~/pool/hooks";
import Link from "next/link";

const Main = styled(Row)`
  justify-content: space-around;
  flex-wrap: wrap;
`;

const KartPage = () => {
  const { provider, wallet } = useWorkspace();
  const { connected } = useWallet();
  const { nfts, revalidate: revalidateNFTs } = useAllNFT(wallet?.publicKey);
  const { poolInfo } = usePool();

  return (
    <AppLayout>
      <WrapperKart>
        <TitleDiv>
          <Title>KART -</Title>
          <Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In,
            voluptates!{" "}
          </Paragraph>
        </TitleDiv>
        {!connected ? (
          <Paragraph>Please Connect Your Wallet</Paragraph>
        ) : (
          <>
            {/* <Button onClick={handleMint} color="primary">
              MOCK MINT
            </Button> */}
            {poolInfo && (
              <Main>
                {nfts.map((nft) => (
                  <Link
                    href={{
                      pathname: `/kart/${nft.tokenAccountAddress.toBase58()}`,
                      query: {
                        mint: nft.mint.toString(),
                        tokenAccountAddress: nft.tokenAccountAddress.toString(),
                      },
                    }}
                  >
                    <a>
                      <KartCard
                        key={nft.tokenAccountAddress.toBase58()}
                        nft={nft}
                      />
                    </a>
                  </Link>
                ))}
              </Main>
            )}
          </>
        )}
      </WrapperKart>
    </AppLayout>
  );
};

const WrapperKart = styled.div`
  margin-top: 2rem;
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

export default KartPage;
