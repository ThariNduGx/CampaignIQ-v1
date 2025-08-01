import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface CampaignTableProps {
  campaigns: any[];
  connections: any[];
}

export default function CampaignTable({ campaigns, connections }: CampaignTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getPlatformIcon = (platformConnectionId: string) => {
    const connection = connections.find(conn => conn.id === platformConnectionId);
    if (!connection) return '';
    
    switch (connection.platform) {
      case 'google':
        return 'fab fa-google text-blue-400';
      case 'meta':
        return 'fab fa-meta text-blue-500';
      default:
        return 'fas fa-link text-slate-400';
    }
  };

  const getPlatformName = (platformConnectionId: string) => {
    const connection = connections.find(conn => conn.id === platformConnectionId);
    if (!connection) return 'Unknown';
    
    switch (connection.platform) {
      case 'google':
        return 'Google Ads';
      case 'meta':
        return 'Meta Ads';
      default:
        return connection.platform;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300';
      case 'paused':
        return 'bg-amber-500/20 text-amber-300';
      case 'ended':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-slate-500/20 text-slate-300';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.7s' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Campaign Performance Details</CardTitle>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-light border-primary-900/20 focus:border-primary-500"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-500/20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No campaigns found</h3>
            <p className="text-slate-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Connect your advertising platforms to see campaign data'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-primary-900/20 hover:bg-transparent">
                  <TableHead className="text-slate-300 font-medium">Campaign</TableHead>
                  <TableHead className="text-slate-300 font-medium">Platform</TableHead>
                  <TableHead className="text-slate-300 font-medium">Status</TableHead>
                  <TableHead className="text-slate-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow 
                    key={campaign.id}
                    className="border-b border-primary-900/20 hover:bg-surface-light/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        <span className="font-medium">{campaign.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <i className={getPlatformIcon(campaign.platformConnectionId)}></i>
                        <span className="text-sm">{getPlatformName(campaign.platformConnectionId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
