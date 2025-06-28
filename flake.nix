{
  inputs = {
    systems.url = "github:nix-systems/x86_64-linux";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = {
    nixpkgs,
    systems,
    ...
  }: let
    supportedSystems = import systems;
    forEachSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {inherit system;};
        });
  in {
    devShells = forEachSystem ({pkgs}: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          bun
          nodejs_latest
          biome
        ];

        LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
        NEXT_PUBLIC_API_URL = "http://54.166.6.159";

        shellHook = ''
          bun i
        '';
      };
    });
  };
}
